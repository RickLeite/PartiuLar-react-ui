import { useState } from "react";
import "./chat.scss";

function Chat() {
    const [chat, setChat] = useState(true);
    return (
        <div className="chat">
            <div className="messages">
                <h1>Mensagens</h1>
                <div className="message">
                    <img
                        src="https://www.webquarto.com.br/images/male_avatar.png"
                        alt=""
                    />
                    <span>Joao</span>
                    <p>Aqui uma mensagem......</p>
                </div>
                <div className="message">
                    <img
                        src="https://www.webquarto.com.br/images/male_avatar.png"
                        alt=""
                    />
                    <span>Joao</span>
                    <p>Aqui uma mensagem......</p>
                </div>
                <div className="message">
                    <img
                        src="https://www.webquarto.com.br/images/male_avatar.png"
                        alt=""
                    />
                    <span>Joao</span>
                    <p>Aqui uma mensagem......</p>
                </div>
                <div className="message">
                    <img
                        src="https://www.webquarto.com.br/images/male_avatar.png"
                        alt=""
                    />
                    <span>Joao</span>
                    <p>Aqui uma mensagem......</p>
                </div>
                <div className="message">
                    <img
                        src="https://www.webquarto.com.br/images/male_avatar.png"
                        alt=""
                    />
                    <span>Joao</span>
                    <p>Aqui uma mensagem......</p>
                </div>
                <div className="message">
                    <img
                        src="https://www.webquarto.com.br/images/male_avatar.png"
                        alt=""
                    />
                    <span>Joao</span>
                    <p>Aqui uma mensagem......</p>
                </div>
            </div>
            {chat && (
                <div className="chatBox">
                    <div className="top">
                        <div className="user">
                            <img
                                src="https://www.webquarto.com.br/images/male_avatar.png"
                                alt=""
                            />
                            Joao
                        </div>
                        <span className="close" onClick={() => setChat(null)}>X</span>
                    </div>
                    <div className="center">
                        <div className="chatMessage">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                        <div className="chatMessage own">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                        <div className="chatMessage">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                        <div className="chatMessage own">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                        <div className="chatMessage">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                        <div className="chatMessage own">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                        <div className="chatMessage">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                        <div className="chatMessage own">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                        <div className="chatMessage">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                        <div className="chatMessage own">
                            <p>Aqui uma mensagem...</p>
                            <span>1 hora atrás</span>
                        </div>
                    </div>
                    <div className="bottom">
                        <textarea></textarea>
                        <button>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;