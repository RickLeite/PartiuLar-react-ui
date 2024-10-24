import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import { useContext, useState } from "react";
import apiRequest from "../../lib/apiRequest"

function ProfilePage() {

      
    return (
        <div className="profilePage">
            <div className="details">
                <div className="wrapper">
                    <div className="title">
                        <h1>Informação</h1>
                        <button>Atualizar Perfil</button>
                    </div>
                    <div className="info">
                        <span>
                            Avatar:
                            <img
                                src="https://www.webquarto.com.br/images/female_avatar.png"
                                alt=""
                            />
                        </span>
                        <span id="nome">
                            Usuario: <b></b>
                        </span>
                        <span id="email">
                            E-mail: <b></b>
                        </span>
                    </div>
                    <div className="title">
                        <h1>Minha Lista</h1>
                        <button>Create New Post</button>
                    </div>
                    <List />
                    <div className="title">
                        <h1>Salvos</h1>
                    </div>
                    <List />
                </div>
            </div>
            <div className="chatContainer">
                <div className="wrapper">
                    <Chat />
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;