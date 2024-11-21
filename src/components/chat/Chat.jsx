import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";


function Chat({ chats: initialChats }) {
    const [chats, setChats] = useState(initialChats);
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState({});
    const { currentUser } = useContext(AuthContext);
    const { socket, isUserOnline, sendMessage, emitTyping } = useContext(SocketContext);
    const messageEndRef = useRef();
    const typingTimeoutRef = useRef({});
    const decrease = useNotificationStore((state) => state.decrease);

    // Scroll to the bottom of the messages
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat?.messages]);

    // Socket connection status debug
    useEffect(() => {
        console.log("Socket status:", {
            isConnected: socket?.connected,
            socketId: socket?.id,
            currentUserId: currentUser?.usuario?.id
        });
    }, [socket?.connected]);

    // Debug socket events
    useEffect(() => {
        if (!socket) return;

        const debugSocketEvent = (eventName) => (...args) => {
            console.log(`Socket ${eventName} event:`, ...args);
        };

        socket.on("connect", debugSocketEvent("connect"));
        socket.on("disconnect", debugSocketEvent("disconnect"));
        socket.on("error", debugSocketEvent("error"));
        socket.on("connect_error", debugSocketEvent("connect_error"));

        return () => {
            socket.off("connect", debugSocketEvent("connect"));
            socket.off("disconnect", debugSocketEvent("disconnect"));
            socket.off("error", debugSocketEvent("error"));
            socket.off("connect_error", debugSocketEvent("connect_error"));
        };
    }, [socket]);

    // Socket message handling
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data) => {
            // Decrease notification count
            decrease();

            // Update current chat if open
            if (chat?.id === data.chatId) {
                setChat(prev => ({
                    ...prev,
                    messages: [...prev.messages, data],
                    lastMessage: data.text,
                    lastMessageAt: new Date()
                }));

                // Mark as read immediately
                apiRequest.post(`/messages/${data.chatId}/read`).catch(console.error);
            }

            // Update chat list
            setChats(prevChats =>
                prevChats.map(c =>
                    c.id === data.chatId
                        ? {
                            ...c,
                            lastMessage: data.text,
                            lastMessageAt: new Date(),
                            unreadCount: chat?.id !== data.chatId ? (c.unreadCount || 0) + 1 : 0
                        }
                        : c
                )
            );
        };

        const handleTyping = ({ chatId, userId, isTyping }) => {
            if (chat?.id === chatId && userId !== currentUser.usuario.id) {
                setTyping(prev => ({
                    ...prev,
                    [userId]: isTyping
                }));
            }
        };

        const handleMessageStatus = ({ status, messageId }) => {
            if (status === "delivered" || status === "error") {
                setChat(prev => ({
                    ...prev,
                    messages: prev.messages.map(msg =>
                        msg.id === messageId
                            ? { ...msg, status }
                            : msg
                    )
                }));
            }
        };

        // Subscribe to socket events
        socket.on("getMessage", handleNewMessage);
        socket.on("userTyping", handleTyping);
        socket.on("messageStatus", handleMessageStatus);

        return () => {
            socket.off("getMessage", handleNewMessage);
            socket.off("userTyping", handleTyping);
            socket.off("messageStatus", handleMessageStatus);
        };
    }, [socket, chat, currentUser.usuario.id, decrease]);

    const handleOpenChat = async (id, receiver) => {
        try {
            setLoading(true);
            const res = await apiRequest.get(`/chats/${id}`);

            setChat({ ...res.data, receiver });

            // Mark messages as read
            if (res.data.unreadCount > 0) {
                await apiRequest.post(`/messages/${id}/read`);
                decrease();
            }

            // Update chat list
            setChats(prevChats =>
                prevChats.map(c =>
                    c.id === id
                        ? { ...c, unreadCount: 0 }
                        : c
                )
            );
        } catch (err) {
            console.error("Error opening chat:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const text = formData.get("text")?.trim();

        if (!text || !chat) return;

        try {
            // Create temporary message with current user format matching the backend
            const tempMessage = {
                id: `temp-${Date.now()}`,
                text,
                senderId: currentUser.usuario.id,
                sender: currentUser.usuario,
                chatId: chat.id,
                createdAt: new Date().toISOString(),
                status: "sending"
            };

            // Optimistic update
            setChat(prev => ({
                ...prev,
                messages: [...prev.messages, tempMessage],
                lastMessage: text,
                lastMessageAt: new Date()
            }));

            e.target.reset();

            // Send to API
            const res = await apiRequest.post(`/messages/${chat.id}`, { text });

            // Send through socket
            const sent = sendMessage(chat.receiver.id, {
                ...res.data,
                chatId: chat.id,
                sender: currentUser.usuario
            });

            // Update with actual message, maintaining the sender information
            setChat(prev => ({
                ...prev,
                messages: prev.messages.map(msg =>
                    msg.id === tempMessage.id
                        ? {
                            ...res.data,
                            sender: currentUser.usuario, // Keep sender information
                            status: sent ? "sent" : "sending"
                        }
                        : msg
                )
            }));

            // Update chat list
            setChats(prevChats =>
                prevChats.map(c =>
                    c.id === chat.id
                        ? {
                            ...c,
                            lastMessage: text,
                            lastMessageAt: new Date()
                        }
                        : c
                )
            );

        } catch (err) {
            console.error("Error sending message:", err);

            // Update message status to error instead of removing it
            setChat(prev => ({
                ...prev,
                messages: prev.messages.map(msg =>
                    msg.id === tempMessage.id
                        ? { ...msg, status: "error" }
                        : msg
                )
            }));
        }
    };

    const handleTyping = (e) => {
        const chatId = chat?.id;
        if (!chatId) return;

        // Clear existing timeout
        if (typingTimeoutRef.current[chatId]) {
            clearTimeout(typingTimeoutRef.current[chatId]);
        }

        // Emit typing status
        emitTyping(chatId, true);

        // Set timeout to stop typing
        typingTimeoutRef.current[chatId] = setTimeout(() => {
            emitTyping(chatId, false);
        }, 2000);
    };

    return (
        <div className="chat">
            <div className="messages">
                <h1>Messages</h1>
                {chats.map((c) => (
                    <div
                        className={`message ${c.unreadCount > 0 ? 'unread' : ''}`}
                        key={c.id}
                        onClick={() => handleOpenChat(c.id, c.receiver)}
                    >
                        <img
                            src={c.receiver.avatar || "/noavatar.jpg"}
                            alt={`${c.receiver.nome}'s avatar`}
                        />
                        <div className="message-info">
                            <div className="message-header">
                                <span className="username">{c.receiver.nome}</span>
                                {isUserOnline(c.receiver.id) && (
                                    <span className="online-status">●</span>
                                )}
                            </div>
                            <p>{c.lastMessage}</p>
                            {c.unreadCount > 0 && (
                                <span className="unread-count">{c.unreadCount}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {chat && (
                <div className="chatBox">
                    <div className="top">
                        <div className="user">
                            <img
                                src={chat.receiver.avatar || "/noavatar.jpg"}
                                alt={`${chat.receiver.nome}'s avatar`}
                            />
                            <div className="user-info">
                                <span>{chat.receiver.nome}</span>
                                {isUserOnline(chat.receiver.id) && (
                                    <span className="online-status">online</span>
                                )}
                            </div>
                        </div>
                        <button onClick={() => setChat(null)}>×</button>
                    </div>

                    <div className="center">
                        {loading ? (
                            <div className="loading">Loading messages...</div>
                        ) : (
                            <>
                                {chat.messages.map((message) => (
                                    <div
                                        className={`chatMessage ${message.senderId === currentUser.usuario.id ? "own" : "other"
                                            } status-${message.status || 'sent'}`}
                                        key={message.id}
                                    >
                                        <p>{message.text}</p>
                                        <span className="message-info">
                                            <span className="time">
                                                {formatDistanceToNow(new Date(message.createdAt), {
                                                    addSuffix: true,
                                                    locale: ptBR
                                                })}
                                            </span>
                                            {message.senderId === currentUser.usuario.id && (
                                                <span className="status">
                                                    {message.status === "sending" && "sending..."}
                                                    {message.status === "sent" && "sent"}
                                                    {message.status === "delivered" && "delivered"}
                                                    {message.status === "error" && (
                                                        <span className="error-status">
                                                            error sending - click to retry
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                                {Object.entries(typing).map(([userId, isTyping]) =>
                                    isTyping && (
                                        <div key={userId} className="typing-indicator">
                                            typing...
                                        </div>
                                    )
                                )}
                                <div ref={messageEndRef} />
                            </>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="bottom">
                        <textarea
                            name="text"
                            placeholder="Type your message..."
                            onChange={handleTyping}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chat;