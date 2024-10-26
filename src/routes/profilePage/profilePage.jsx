import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
    const data = useLoaderData();
    const { updateUser, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await apiRequest.post("/auth/logout");
            updateUser(null);
            navigate("/");
        } catch (err) {
            console.error("Erro ao fazer logout:", err);
        }
    };

    // Early return if currentUser or currentUser.usuario is not available
    if (!currentUser?.usuario) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="profilePage">
            <div className="details">
                <div className="wrapper">
                    <div className="title">
                        <h1>Informações do Usuário</h1>
                        <Link to="/profile/update">
                            <button>Atualizar Perfil</button>
                        </Link>
                    </div>
                    <div className="info">
                        <span>
                            Avatar:
                            <img
                                src={currentUser.usuario.avatar || "/noavatar.jpg"}
                                alt={`Avatar de ${currentUser.usuario.nome}`}
                            />
                        </span>
                        <span>
                            Nome: <b>{currentUser.usuario.nome}</b>
                        </span>
                        <span>
                            Email: <b>{currentUser.usuario.email}</b>
                        </span>
                        <span>
                            Telefone: <b>{currentUser.usuario.telefone}</b>
                        </span>
                        <span>
                            Gênero: <b>{currentUser.usuario.genero}</b>
                        </span>
                        <button onClick={handleLogout}>Sair</button>
                    </div>
                    <div className="title">
                        <h1>Meus Anúncios</h1>
                        <Link to="/add">
                            <button>Criar Novo Anúncio</button>
                        </Link>
                    </div>
                    <Suspense fallback={<p>Carregando...</p>}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={<p>Erro ao carregar anúncios!</p>}
                        >
                            {(postResponse) => <List posts={postResponse.data.userPosts} />}
                        </Await>
                    </Suspense>
                    <div className="title">
                        <h1>Anúncios Salvos</h1>
                    </div>
                    <Suspense fallback={<p>Carregando...</p>}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={<p>Erro ao carregar anúncios salvos!</p>}
                        >
                            {(postResponse) => <List posts={postResponse.data.savedPosts} />}
                        </Await>
                    </Suspense>
                </div>
            </div>
            <div className="chatContainer">
                <div className="wrapper">
                    <Suspense fallback={<p>Carregando...</p>}>
                        <Await
                            resolve={data.chatResponse}
                            errorElement={<p>Erro ao carregar conversas!</p>}
                        >
                            {(chatResponse) => <Chat chats={chatResponse.data} />}
                        </Await>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;