import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";

function HomePage() {
    return (
        <div className="homePage">
            <div className="textContainer">
                <div className="wrapper">
                    <h1 className="title">Com o PartiuLar encontre o seu lar universitario</h1>
                    <p>
                        Republicas, Aps compartilhados, Kitnets e muito mais
                    </p>
                    <SearchBar />
                    <div className="boxes">
                        <div className="box">
                            <h1>3</h1>
                            <h2>Anos de Mercado</h2>
                        </div>
                        <div className="box">
                            <h1>PREMIADO</h1>
                            <h2>Pela Revista Veja e OGlobo</h2>
                        </div>
                        <div className="box">
                            <h1>270</h1>
                            <h2>Repúblicas</h2>
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