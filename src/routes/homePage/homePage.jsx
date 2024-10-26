import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";

function HomePage() {
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
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default HomePage;
