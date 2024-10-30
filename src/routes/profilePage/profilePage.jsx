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
            localStorage.removeItem("user"); // Garantindo que o localStorage também seja limpo
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
                    {/* Seção de Informações do Usuário */}
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

                    {/* Seção de Meus Anúncios */}
                    <div className="title">
                        <h1>Meus Anúncios</h1>
                        <Link to="/add">
                            <button>Criar Novo Anúncio</button>
                        </Link>
                    </div>
                    <Suspense fallback={<div className="loading">Carregando anúncios...</div>}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={
                                <div className="error">
                                    Erro ao carregar anúncios. Tente novamente mais tarde.
                                </div>
                            }
                        >
                            {(postResponse) => {
                                const posts = postResponse?.data?.posts || [];
                                const stats = postResponse?.data?.stats || {};

                                return (
                                    <>
                                        <div className="stats">
                                            <div className="stat-item">
                                                <span>Total de Anúncios:</span>
                                                <b>{stats.totalPosts || 0}</b>
                                            </div>
                                            <div className="stat-item">
                                                <span>Valor Total:</span>
                                                <b>R$ {stats.totalValue?.toLocaleString('pt-BR') || 0}</b>
                                            </div>
                                            <div className="stat-item">
                                                <span>Anúncios Ativos:</span>
                                                <b>{stats.postsAtivos || 0}</b>
                                            </div>
                                        </div>
                                        {posts.length > 0 ? (
                                            <List posts={posts} />
                                        ) : (
                                            <div className="no-posts">
                                                <p>Você ainda não tem nenhum anúncio.</p>
                                                <Link to="/add">
                                                    <button>Criar Primeiro Anúncio</button>
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                );
                            }}
                        </Await>
                    </Suspense>

                    {/* Seção de Anúncios Salvos */}
                    <div className="title">
                        <h1>Anúncios Salvos</h1>
                    </div>
                    <Suspense fallback={<div className="loading">Carregando anúncios salvos...</div>}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={
                                <div className="error">
                                    Erro ao carregar anúncios salvos. Tente novamente mais tarde.
                                </div>
                            }
                        >
                            {(postResponse) => {
                                const savedPosts = postResponse?.data?.savedPosts || [];
                                return savedPosts.length > 0 ? (
                                    <List posts={savedPosts} />
                                ) : (
                                    <div className="no-posts">
                                        <p>Você ainda não salvou nenhum anúncio.</p>
                                        <Link to="/list">
                                            <button>Explorar Anúncios</button>
                                        </Link>
                                    </div>
                                );
                            }}
                        </Await>
                    </Suspense>
                </div>
            </div>

            {/* Seção de Chat */}
            <div className="chatContainer">
                <div className="wrapper">
                    <Suspense fallback={<div className="loading">Carregando conversas...</div>}>
                        <Await
                            resolve={data.chatResponse}
                            errorElement={
                                <div className="error">
                                    Erro ao carregar conversas. Tente novamente mais tarde.
                                </div>
                            }
                        >
                            {(chatResponse) => {
                                const chats = chatResponse?.data || [];
                                return chats.length > 0 ? (
                                    <Chat chats={chats} />
                                ) : (
                                    <div className="no-chats">
                                        <p>Você ainda não tem nenhuma conversa.</p>
                                    </div>
                                );
                            }}
                        </Await>
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;