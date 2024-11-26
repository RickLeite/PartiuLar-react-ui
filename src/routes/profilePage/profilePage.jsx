import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";

function ProfilePage() {
    const data = useLoaderData();
    const { updateUser, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDeletePost = async (postId) => {
        try {
            const loadingToast = toast.loading("Removendo anúncio...");
            const response = await apiRequest.delete(`/posts/${postId}`);
            toast.dismiss(loadingToast);

            if (response.status === 200) {
                toast.success("Anúncio removido com sucesso!");
                // Recarrega a página após um pequeno delay para mostrar o toast
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (err) {
            console.error("Erro ao deletar anúncio:", err);

            if (err.response?.status === 403) {
                toast.error("Você não tem permissão para remover este anúncio");
            } else if (err.response?.status === 404) {
                toast.error("Anúncio não encontrado");
            } else if (err.response?.status === 401) {
                toast.error("Sua sessão expirou. Por favor, faça login novamente");
                navigate("/login");
            } else {
                toast.error("Erro ao remover anúncio. Tente novamente mais tarde");
            }
        }
    };

    const handleLogout = async () => {
        try {
            await apiRequest.post("/auth/logout");
            updateUser(null);
            localStorage.removeItem("user");
            navigate("/");
        } catch (err) {
            console.error("Erro ao fazer logout:", err);
            toast.error("Erro ao fazer logout. Tente novamente.");
        }
    };

    if (!currentUser?.usuario) {
        return <div className="loading">Carregando...</div>;
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
                        {currentUser.usuario.telefone && (
                            <span>
                                Telefone: <b>{currentUser.usuario.telefone}</b>
                            </span>
                        )}
                        {currentUser.usuario.genero && (
                            <span>
                                Gênero: <b>{currentUser.usuario.genero}</b>
                            </span>
                        )}
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
                                        </div>
                                        {posts.length > 0 ? (
                                            <List
                                                posts={posts.map(post => ({
                                                    ...post,
                                                    usuario: {
                                                        ...post.usuario,
                                                        id: currentUser.usuario.id
                                                    }
                                                }))}
                                                onDelete={handleDeletePost}
                                            />
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
}

export default ProfilePage;