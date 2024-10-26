import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
    const [open, setOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const defaultAvatar = "/noavatar.jpg";

    return (
        <nav>
            <div className="left">
                <Link to="/" className="logo">
                    <img src="/logo.png" alt="" />
                    <span>PartiuLar</span>
                </Link>
                <Link to="/list">Lista</Link>
                <Link to="/about">Sobre-Nós</Link>
                <Link to="/contact">Contato</Link>
            </div>
            <div className="right">
                {currentUser ? (
                    <div className="user">
                        <div className="user-info">
                            <img
                                src={currentUser.usuario.avatar || defaultAvatar}
                                alt={`${currentUser.usuario.nome}'s profile`}
                            />
                            <span className="user-name">{currentUser.usuario.nome}</span>
                        </div>
                        <Link to="/profile" className="profile">
                            {currentUser.notifications > 0 && (
                                <div className="notification">{currentUser.notifications}</div>
                            )}
                            <span>Perfil</span>
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/login">Entrar</Link>
                        <Link to="/register" className="register">
                            Registrar
                        </Link>
                    </>
                )}
                <div className="menuIcon">
                    <img
                        src="/menu.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <Link to="/">Início</Link>
                    <Link to="/list">Lista</Link>
                    <Link to="/about">Sobre-Nós</Link>
                    <Link to="/contact">Contato</Link>
                    {!currentUser && (
                        <>
                            <Link to="/login">Entrar</Link>
                            <Link to="/register">Registrar</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;