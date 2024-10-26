import { useState, useEffect } from "react";
import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import apiRequest from "../../lib/apiRequest";
import { useParams } from "react-router-dom";

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

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;
    if (!post) return <div>Post não encontrado</div>;

    // Parse the JSON string back to an array
    const images = Array.isArray(post.img) ? post.img : JSON.parse(post.img);

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
                        <div className="bottom">{post.descricao}</div>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="wrapper">
                    <p className="title">Geral</p>
                    <div className="listVertical">
                        <div className="feature">
                            <img src="/utility.png" alt="" />
                            <div className="featureText">
                                <span>Utilidades</span>
                                <p>Responsabilidade do inquilino</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/pet.png" alt="" />
                            <div className="featureText">
                                <span>Política de Animais</span>
                                <p>Animais Permitidos</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/fee.png" alt="" />
                            <div className="featureText">
                                <span>Taxas da Propriedade</span>
                                <p>Deve ter 3x o aluguel em renda familiar total</p>
                            </div>
                        </div>
                    </div>
                    <p className="title">Tamanhos</p>
                    <div className="sizes">
                        <div className="size">
                            <img src="/size.png" alt="" />
                            <span>80 m²</span>
                        </div>
                        <div className="size">
                            <img src="/bed.png" alt="" />
                            <span>2 camas</span>
                        </div>
                        <div className="size">
                            <img src="/bath.png" alt="" />
                            <span>1 banheiro</span>
                        </div>
                    </div>
                    <p className="title">Lugares Próximos</p>
                    <div className="listHorizontal">
                        <div className="feature">
                            <img src="/school.png" alt="" />
                            <div className="featureText">
                                <span>Escola</span>
                                <p>250m de distância</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/bus.png" alt="" />
                            <div className="featureText">
                                <span>Ponto de Ônibus</span>
                                <p>100m de distância</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/restaurant.png" alt="" />
                            <div className="featureText">
                                <span>Restaurante</span>
                                <p>200m de distância</p>
                            </div>
                        </div>
                    </div>
                    {post.latitude && post.longitude && (
                        <div className="mapContainer">
                            <Map items={[post]} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SinglePage;