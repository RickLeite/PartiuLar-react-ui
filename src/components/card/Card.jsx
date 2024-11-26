import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { MessageSquare, Trash2 } from "lucide-react";
import "./card.scss";
import { toast } from "sonner";
import apiRequest from "../../lib/apiRequest";

function Card({ item, onDelete }) {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const isOwner = currentUser?.usuario?.id === item.usuario?.id;

    const getFirstImage = (imgField) => {
        try {
            if (typeof imgField === 'string' && !imgField.startsWith('[')) {
                return imgField;
            }

            const imgArray = typeof imgField === 'string'
                ? JSON.parse(imgField)
                : imgField;

            return Array.isArray(imgArray) && imgArray.length > 0
                ? imgArray[0]
                : '/placeholder-house.jpg';
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
            return '/placeholder-house.jpg';
        }
    };

    const handleChatClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Verificar se tem usuário logado
        if (!currentUser) {
            toast.error("Você precisa estar logado para iniciar uma conversa");
            navigate("/login");
            return;
        }

        // Verificar dados do anunciante usando usuarioId do post
        const postOwnerId = item.usuario?.id;

        if (!postOwnerId) {
            toast.error("Não foi possível identificar o anunciante");
            return;
        }

        // Verificar se não está tentando conversar consigo mesmo
        if (currentUser.usuario.id === postOwnerId) {
            toast.error("Você não pode iniciar uma conversa com você mesmo");
            return;
        }

        try {
            // Mostrar loading
            const loadingToast = toast.loading("Iniciando conversa...");

            // Criar chat
            const response = await apiRequest.post("/chats", {
                receiverId: postOwnerId
            });

            // Remover loading
            toast.dismiss(loadingToast);

            if (response.status === 201 || response.status === 200) {
                toast.success("Chat iniciado com sucesso!");
                navigate("/profile");
            }
        } catch (error) {
            console.error("Erro ao criar chat:", error);

            if (error.response?.status === 403) {
                toast.error("Você não tem permissão para iniciar esta conversa");
            } else if (error.response?.status === 404) {
                toast.error("Usuário não encontrado");
            } else if (error.response?.status === 401) {
                toast.error("Sua sessão expirou. Por favor, faça login novamente");
                navigate("/login");
            } else {
                toast.error("Erro ao iniciar conversa. Tente novamente mais tarde");
            }
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Tem certeza que deseja remover este anúncio?")) {
            return;
        }

        try {
            const loadingToast = toast.loading("Removendo anúncio...");

            const response = await apiRequest.delete(`/posts/${item.id}`);

            toast.dismiss(loadingToast);

            if (response.status === 200) {
                toast.success("Anúncio removido com sucesso!");
                if (onDelete) {
                    onDelete(item.id);
                }
                // Recarrega a página após um pequeno delay para mostrar o toast
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error("Erro ao remover anúncio:", error);

            if (error.response?.status === 403) {
                toast.error("Você não tem permissão para remover este anúncio");
            } else if (error.response?.status === 404) {
                toast.error("Anúncio não encontrado");
            } else if (error.response?.status === 401) {
                toast.error("Sua sessão expirou. Por favor, faça login novamente");
                navigate("/login");
            } else {
                toast.error("Erro ao remover anúncio. Tente novamente mais tarde");
            }
        }
    };

    const imageUrl = item.img ? getFirstImage(item.img) : '/placeholder-house.jpg';

    return (
        <div className="card">
            <Link to={`/${item.id}`} className="imageContainer">
                <img src={imageUrl} alt={item.titulo || "Anúncio"} />
            </Link>
            <div className="textContainer">
                <h2 className="titulo">
                    <Link to={`/${item.id}`}>{item.titulo || "Título não disponível"}</Link>
                </h2>
                <p className="endereco">
                    <img src="/pin.png" alt="Location Pin" />
                    <span>{item.endereco || "Endereço não disponível"}</span>
                </p>
                <p className="preco">R$ {item.preco?.toLocaleString('pt-BR') || "Preço não disponível"}</p>
                <div className="bottom">
                    <div className="author">
                        <span>Anunciante: {item.usuario?.nome || "Nome não disponível"}</span>
                    </div>
                    <div className="icons">
                        {!isOwner && (
                            <button
                                type="button"
                                onClick={handleChatClick}
                                className="icon chat-icon"
                                title="Iniciar conversa"
                            >
                                <MessageSquare size={20} />
                            </button>
                        )}
                        {isOwner && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="icon delete-icon"
                                title="Remover anúncio"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;