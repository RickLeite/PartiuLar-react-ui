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
                    <h1 className="title">Divida o espaço com quem combina com você.</h1>
                    <p>
                        Partiular conecta universitários em busca de moradia compartilhada, facilitando a escolha de colegas de quarto com interesses em comum. Nossa plataforma oferece uma experiência personalizada e segura, onde a convivência harmoniosa é prioridade.
                    </p>
                    <SearchBar />
                    <div className="boxes">
                        <div className="box">
                            <h1>5+</h1>
                            <h2>Anos no mercado</h2>
                        </div>
                        <div className="box">
                            <h1>2000+</h1>
                            <h2>Casas disponíveis</h2>
                        </div>
                        <div className="box">
                            <h1>10000+</h1>
                            <h2>Usuários</h2>
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
