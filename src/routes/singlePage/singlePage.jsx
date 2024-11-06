import { useState, useEffect } from "react";
import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import apiRequest from "../../lib/apiRequest";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

function SinglePage() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiRequest.get(`/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.response?.data?.message || "Erro ao carregar post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">Erro: {error}</div>;
    if (!post) return <div className="not-found">Post não encontrado</div>;

    // Parse the JSON string back to an array
    let images;
    try {
        images = Array.isArray(post.img) ? post.img : JSON.parse(post.img);
    } catch (e) {
        images = [];
    }

    // Use placeholder image if no images are available
    if (!images || images.length === 0) {
        images = ["/placeholder-house.jpg"];
    }

    // Sanitize the description HTML
    const sanitizedDescription = DOMPurify.sanitize(post.descricao);

    // Validação básica das coordenadas
    const hasValidCoordinates = post.latitude && post.longitude &&
        !isNaN(parseFloat(post.latitude)) && !isNaN(parseFloat(post.longitude));

    return (
        <div className="singlePage">
            <div className="details">
                <div className="wrapper">
                    <Slider images={images} showAllImages={false} />
                    <div className="info">
                        <div className="top">
                            <div className="post">
                                <h1>{post.titulo}</h1>
                                <div className="address">
                                    <img src="/pin.png" alt="" />
                                    <span>{post.endereco}</span>
                                </div>
                                <div className="price">R$ {post.preco}</div>
                            </div>
                            {post.usuario && (
                                <div className="user">
                                    <img
                                        src={post.usuario.avatar || "/noavatar.jpg"}
                                        alt={post.usuario.nome}
                                    />
                                    <span>{post.usuario.nome}</span>
                                </div>
                            )}
                        </div>
                        <div className="bottom" dangerouslySetInnerHTML={{ __html: sanitizedDescription }}></div>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="wrapper">
                    {/* Área para características dinâmicas da propriedade */}
                    {post.caracteristicas && (
                        <div className="listVertical">
                            {post.caracteristicas.map((caracteristica, index) => (
                                <div key={index} className="feature">
                                    <img src={caracteristica.icone} alt="" />
                                    <div className="featureText">
                                        <span>{caracteristica.titulo}</span>
                                        <p>{caracteristica.descricao}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Área para informações de tamanho e cômodos */}
                    {post.detalhes && (
                        <div className="sizes">
                            {post.detalhes.map((detalhe, index) => (
                                <div key={index} className="size">
                                    <img src={detalhe.icone} alt="" />
                                    <span>{detalhe.valor}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Área para pontos de interesse próximos */}
                    {post.pontosProximos && (
                        <div className="listHorizontal">
                            {post.pontosProximos.map((ponto, index) => (
                                <div key={index} className="feature">
                                    <img src={ponto.icone} alt="" />
                                    <div className="featureText">
                                        <span>{ponto.titulo}</span>
                                        <p>{ponto.distancia}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mapContainer">
                        {post && (
                            <Map
                                items={[{
                                    ...post,
                                    latitude: post.latitude,
                                    longitude: post.longitude
                                }]}
                                isSinglePost={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePage;