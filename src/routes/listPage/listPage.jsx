import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useSearchParams } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
    const data = useLoaderData();
    const [searchParams] = useSearchParams();

    // Custom loading component
    const LoadingPlaceholder = () => (
        <div className="loadingPlaceholder">
            <div className="spinner"></div>
            <p>Carregando anúncios...</p>
        </div>
    );

    // Custom error component
    const ErrorDisplay = ({ message }) => (
        <div className="errorDisplay">
            <img src="/error.png" alt="Error" />
            <h3>Ops! Algo deu errado</h3>
            <p>{message || "Erro ao carregar os anúncios"}</p>
        </div>
    );

    // No results component
    const NoResults = () => (
        <div className="noResults">
            <img src="/no-results.png" alt="No Results" />
            <h3>Nenhum anúncio encontrado</h3>
            <p>Tente ajustar seus filtros de busca</p>
        </div>
    );

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
                                                    title: post.titulo,
                                                    img: post.img?.[0] || '/placeholder.png',
                                                    bedroom: post.quartos || 1,
                                                    bathroom: post.banheiros || 1,
                                                    price: post.preco,
                                                    address: post.endereco,
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
                                centerLat={searchParams.get('lat') || -22.834560}
                                centerLng={searchParams.get('lng') || -47.052783}
                                zoom={searchParams.get('zoom') || 14}
                            />
                        )}
                    </Await>
                </Suspense>
            </div>
        </div>
    );
}

export default ListPage;