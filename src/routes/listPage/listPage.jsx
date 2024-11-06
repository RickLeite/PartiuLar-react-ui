import { useState, Suspense } from "react";
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useSearchParams } from "react-router-dom";

function ListPage() {
    const data = useLoaderData();
    const [searchParams] = useSearchParams();

    // Loading component
    const LoadingPlaceholder = () => (
        <div className="loadingPlaceholder">
            <div className="spinner"></div>
            <p>Carregando anúncios...</p>
        </div>
    );

    // Error component
    const ErrorDisplay = ({ message }) => (
        <div className="errorDisplay">
            <img src="/error-icon.png" alt="Error" />
            <h3>Ops! Algo deu errado</h3>
            <p>{message || "Erro ao carregar os anúncios"}</p>
        </div>
    );

    // No results component
    const NoResults = () => (
        <div className="noResults">
            <img src="/no-results-icon.png" alt="Sem resultados" />
            <h3>Nenhum anúncio encontrado</h3>
            <p>Tente ajustar seus filtros de busca</p>
        </div>
    );

    // Image processing function
    const processImages = (img) => {
        const placeholder = '/placeholder-house.jpg';

        if (!img) return [placeholder];

        if (typeof img === 'string') {
            try {
                const parsedImages = JSON.parse(img);
                return Array.isArray(parsedImages) && parsedImages.length > 0
                    ? parsedImages
                    : [placeholder];
            } catch {
                return [placeholder];
            }
        }

        return Array.isArray(img) && img.length > 0 ? img : [placeholder];
    };

    return (
        <div className="listPage">
            <div className="listContainer">
                <div className="wrapper">
                    <Filter initialParams={Object.fromEntries(searchParams)} />

                    <Suspense fallback={<LoadingPlaceholder />}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={<ErrorDisplay />}
                        >
                            {(postResponse) => {
                                const posts = postResponse.data;

                                if (!posts || posts.length === 0) {
                                    return <NoResults />;
                                }

                                return (
                                    <div className="cardsGrid">
                                        {posts.map(post => (
                                            <Card
                                                key={post.id}
                                                item={{
                                                    id: post.id,
                                                    titulo: post.titulo,
                                                    img: processImages(post.img)[0],
                                                    bedroom: post.quartos || 1,
                                                    bathroom: post.banheiros || 1,
                                                    preco: post.preco,
                                                    endereco: post.endereco,
                                                    cidade: post.cidade,
                                                    estado: post.estado,
                                                    latitude: post.latitude,
                                                    longitude: post.longitude,
                                                    usuario: post.usuario
                                                }}
                                            />
                                        ))}
                                    </div>
                                );
                            }}
                        </Await>
                    </Suspense>
                </div>
            </div>

            <div className="mapContainer">
                <Suspense fallback={<LoadingPlaceholder />}>
                    <Await
                        resolve={data.postResponse}
                        errorElement={<ErrorDisplay />}
                    >
                        {(postResponse) => (
                            <Map
                                items={postResponse.data}
                                centerLat={searchParams.get('lat')}
                                centerLng={searchParams.get('lng')}
                                zoom={searchParams.get('zoom')}
                            />
                        )}
                    </Await>
                </Suspense>
            </div>
        </div>
    );
}

export default ListPage;