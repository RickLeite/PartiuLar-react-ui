import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

function HomePage() {
    const { currentUser } = useContext(AuthContext);

    const stats = [
        {
            number: "3",
            label: "Anos de Mercado",
            description: "Experiência em moradia universitária"
        },
        {
            number: "PREMIADO",
            label: "Pela Revista Veja e OGlobo",
            description: "Reconhecimento nacional"
        },
        {
            number: "270+",
            label: "Repúblicas",
            description: "Moradias disponíveis"
        }
    ];

    return (
        <div className="homePage">
            <div className="textContainer">
                <div className="wrapper">
                    <div className="heroSection">
                        <h1 className="title">
                            Com o PartiuLar encontre o seu{" "}
                            <span className="highlight">Lar universitário</span>
                        </h1>
                        <p className="subtitle">
                            Repúblicas, Apartamentos compartilhados, Kitnets e muito mais
                            para sua vida acadêmica
                        </p>
                        <SearchBar />
                        {!currentUser && (
                            <div className="cta-buttons">
                                <Link to="/register" className="register-btn">
                                    Cadastre-se Gratuitamente
                                </Link>
                                <Link to="/about" className="learn-more-btn">
                                    Saiba Mais
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="boxes">
                        {stats.map((stat, index) => (
                            <div className="box" key={index}>
                                <h1>{stat.number}</h1>
                                <h2>{stat.label}</h2>
                                <p>{stat.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="features">
                        <h3>Por que escolher o PartiuLar?</h3>
                        <div className="feature-grid">
                            <div className="feature">
                                <img src="/university.png" alt="Localização" />
                                <h4>Próximo à Universidade</h4>
                                <p>Localizações estratégicas</p>
                            </div>
                            <div className="feature">
                                <img src="/assistance.webp" alt="Suporte" />
                                <h4>Suporte 24/7</h4>
                                <p>Assistência quando precisar</p>
                            </div>
                        </div>
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