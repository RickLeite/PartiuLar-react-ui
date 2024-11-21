// SocketContext.jsx
import { createContext, useEffect, useState, useContext, useCallback } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const { currentUser } = useContext(AuthContext);

    console.log("SocketContextProvider - Current User:", currentUser?.usuario);

    // Socket connection management
    useEffect(() => {
        let newSocket = null;

        if (currentUser?.usuario?.id) {
            console.log("Attempting to connect socket for user:", currentUser.usuario.id);

            newSocket = io("http://localhost:4000", {
                transports: ["websocket"],
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                autoConnect: true
            });

            // Connection events
            newSocket.on("connect", () => {
                console.log("Socket connected successfully:", newSocket.id);
                newSocket.emit("newUser", currentUser.usuario.id);
            });

            newSocket.on("connect_error", (error) => {
                console.error("Socket connection error:", error.message);
            });

            newSocket.on("disconnect", (reason) => {
                console.log("Socket disconnected:", reason);
                setOnlineUsers(new Set());
            });

            // User status events
            newSocket.on("userOnline", ({ userId }) => {
                console.log("User came online:", userId);
                setOnlineUsers(prev => new Set([...prev, userId]));
            });

            newSocket.on("userOffline", ({ userId }) => {
                console.log("User went offline:", userId);
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    return newSet;
                });
            });

            setSocket(newSocket);
        } else {
            console.log("No user logged in, skipping socket connection");
        }

        return () => {
            if (newSocket) {
                console.log("Cleaning up socket connection");
                newSocket.disconnect();
            }
        };
    }, [currentUser?.usuario?.id]);

    const sendMessage = useCallback((receiverId, data) => {
        console.log("Attempting to send message:", { receiverId, data });
        console.log("Socket status:", socket?.connected);

        if (socket?.connected) {
            socket.emit("sendMessage", { receiverId, data });
            console.log("Message emitted through socket");
            return true;
        } else {
            console.warn("Socket not connected, message not sent");
            return false;
        }
    }, [socket]);

    const emitTyping = useCallback((chatId, isTyping = true) => {
        console.log("Emitting typing status:", { chatId, isTyping });
        if (socket?.connected) {
            socket.emit("typing", { chatId, isTyping });
        }
    }, [socket]);

    const value = {
        socket,
        isConnected: socket?.connected || false,
        isUserOnline: useCallback((userId) => onlineUsers.has(userId?.toString()), [onlineUsers]),
        onlineUsers: Array.from(onlineUsers),
        sendMessage,
        emitTyping
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};