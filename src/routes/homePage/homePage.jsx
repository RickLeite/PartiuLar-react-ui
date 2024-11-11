import { useContext, useEffect } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function HomePage() {
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        // Adiciona classe de fade-in quando o componente monta
        const textContainer = document.querySelector('.textContainer');
        const imgContainer = document.querySelector('.imgContainer');

        if (textContainer) textContainer.classList.add('fade-in');
        if (imgContainer) imgContainer.classList.add('slide-in');
    }, []);

    const stats = [
        {
            number: "5+",
            label: "Anos no mercado"
        },
        {
            number: "2000+",
            label: "Casas disponíveis"
        },
        {
            number: "10000+",
            label: "Usuários"
        }
    ];

    return (
        <div className="homePage">
            <div className="textContainer">
                <div className="wrapper">
                    <h1 className="title">
                        Divida o espaço com quem combina com você
                        <span className="title-dot">.</span>
                    </h1>
                    <p className="subtitle">
                        Partiular conecta universitários em busca de moradia compartilhada,
                        facilitando a escolha de colegas de quarto com interesses em comum.
                        Nossa plataforma oferece uma experiência personalizada e segura,
                        onde a convivência harmoniosa é prioridade.
                    </p>
                    <div className="search-section">
                        <SearchBar />
                    </div>
                    <div className="boxes">
                        {stats.map((stat, index) => (
                            <div className="box" key={index}>
                                <h1>{stat.number}</h1>
                                <h2>{stat.label}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="imgContainer">
                <div className="overlay"></div>
                <img
                    src="/bg.png"
                    alt="Estudantes em uma república"
                    loading="eager"
                />
                {currentUser && (
                    <div className="welcome-badge">
                        <p>Bem-vindo de volta, {currentUser.usuario.nome}!</p>
                        <Link to="/profile" className="profile-link">
                            Ver Perfil
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;