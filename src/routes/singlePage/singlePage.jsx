import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
const UserInfo = ({ user }) => (
    <div className="user">
        <img
            src={user?.avatar || AvatarPlaceholder}
            alt={user?.nome}
        />
        <span>{user?.nome}</span>
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
                            {post.usuario && <UserInfo user={post.usuario} />}
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