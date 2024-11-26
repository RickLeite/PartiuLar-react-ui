import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import apiRequest from "../../lib/apiRequest";
import "./singlePage.scss";

const ImagePlaceholder = "/placeholder-house.jpg";
const AvatarPlaceholder = "/noavatar.jpg";

// Utility functions
const parseImages = (imageData) => {
    try {
        return Array.isArray(imageData) ? imageData : JSON.parse(imageData);
    } catch (e) {
        return [ImagePlaceholder];
    }
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
};

// Component for property header information
const PropertyHeader = ({ title, address, price }) => (
    <div className="post">
        <h1>{title}</h1>
        <div className="address">
            <img src="/pin.png" alt="" />
            <span>{address}</span>
        </div>
        <div className="price">{formatPrice(price)}</div>
    </div>
);

// Component for user information
const UserInfo = ({ user, onChatClick, onDeleteClick, isOwner }) => (
    <div className="user">
        <img
            src={user?.avatar || AvatarPlaceholder}
            alt={user?.nome}
        />
        <span>{user?.nome}</span>
        <div className="user-actions">
            {!isOwner && onChatClick && (
                <button
                    onClick={onChatClick}
                    className="action-button chat-button"
                    title="Iniciar conversa"
                >
                    <MessageSquare size={20} />
                </button>
            )}
            {isOwner && onDeleteClick && (
                <button
                    onClick={onDeleteClick}
                    className="action-button delete-button"
                    title="Remover anúncio"
                >
                    <Trash2 size={20} />
                </button>
            )}
        </div>
    </div>
);

// Component for property features
const PropertyFeatures = ({ features }) => (
    <div className="listVertical">
        {features?.map((feature, index) => (
            <div key={index} className="feature">
                <img src={feature.icone} alt="" />
                <div className="featureText">
                    <span>{feature.titulo}</span>
                    <p>{feature.descricao}</p>
                </div>
            </div>
        ))}
    </div>
);

// Component for property details/sizes
const PropertySizes = ({ details }) => (
    <div className="sizes">
        {details?.map((detail, index) => (
            <div key={index} className="size">
                <img src={detail.icone} alt="" />
                <span>{detail.valor}</span>
            </div>
        ))}
    </div>
);

// Component for nearby points of interest
const NearbyPoints = ({ points }) => (
    <div className="listHorizontal">
        {points?.map((point, index) => (
            <div key={index} className="feature">
                <img src={point.icone} alt="" />
                <div className="featureText">
                    <span>{point.titulo}</span>
                    <p>{point.distancia}</p>
                </div>
            </div>
        ))}
    </div>
);

// Loading state component
const LoadingState = () => (
    <div className="loading-container">
        <div className="loading-spinner"></div>
        <span>Carregando informações do imóvel...</span>
    </div>
);

// Error state component
const ErrorState = ({ message }) => (
    <div className="error-container">
        <img src="/error-icon.png" alt="Erro" />
        <h2>Ops! Algo deu errado</h2>
        <p>{message}</p>
    </div>
);

function SinglePage() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const isOwner = currentUser?.usuario?.id === post?.usuario?.id;

    const handleChatClick = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Verificar se tem usuário logado
        if (!currentUser) {
            toast.error("Você precisa estar logado para iniciar uma conversa");
            navigate("/login");
            return;
        }

        // Verificar dados do anunciante
        const postOwnerId = post.usuario?.id;
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
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!confirm("Tem certeza que deseja remover este anúncio?")) {
            return;
        }

        try {
            const loadingToast = toast.loading("Removendo anúncio...");

            const response = await apiRequest.delete(`/posts/${id}`);

            toast.dismiss(loadingToast);

            if (response.status === 200) {
                toast.success("Anúncio removido com sucesso!");
                // Navega para o perfil após um pequeno delay para mostrar o toast
                setTimeout(() => {
                    navigate("/profile");
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

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await apiRequest.get(`/posts/${id}`);
                setPost(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.response?.data?.message || "Não foi possível carregar as informações do imóvel");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!post) return <ErrorState message="Imóvel não encontrado" />;

    const images = parseImages(post.img);
    const sanitizedDescription = DOMPurify.sanitize(post.descricao);
    const hasValidCoordinates = post.latitude && post.longitude &&
        !isNaN(parseFloat(post.latitude)) && !isNaN(parseFloat(post.longitude));

    return (
        <div className="singlePage">
            <div className="details">
                <div className="wrapper">
                    <Slider images={images} showAllImages={false} />
                    <div className="info">
                        <div className="top">
                            <PropertyHeader
                                title={post.titulo}
                                address={post.endereco}
                                price={post.preco}
                            />
                            {post.usuario && (
                                <UserInfo
                                    user={post.usuario}
                                    onChatClick={handleChatClick}
                                    onDeleteClick={handleDelete}
                                    isOwner={isOwner}
                                />
                            )}
                        </div>
                        <div
                            className="bottom description"
                            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                        />
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="wrapper">
                    {post.caracteristicas && (
                        <PropertyFeatures features={post.caracteristicas} />
                    )}

                    {post.detalhes && (
                        <PropertySizes details={post.detalhes} />
                    )}

                    {post.pontosProximos && (
                        <NearbyPoints points={post.pontosProximos} />
                    )}

                    {hasValidCoordinates && (
                        <div className="mapContainer">
                            <Map
                                items={[{
                                    ...post,
                                    latitude: post.latitude,
                                    longitude: post.longitude
                                }]}
                                isSinglePost={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SinglePage;