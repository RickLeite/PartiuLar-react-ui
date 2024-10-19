import "./navbar.scss"
import { useState } from "react"

function Navbar() {
    const [open, setOpen] = useState(false)
    return (
        <nav>
            <div className="left">
                <a href="/" className="logo">
                    <img src="/logo.png" alt="logo" />
                    <span>PartiuLar</span>
                </a>
                <a href="/">Home</a>
                <a href="/">Sobre Nós</a>
                <a href="/">Contato</a>
            </div>
            <div className="right">
                <a href="/">Login</a>
                <a href="/" className="register">Registro</a>
                <div className="menuIcon">
                    <img src="/menu.png" alt="menu" onClick={() => setOpen((prev) => !prev)} />
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <a href="/">Home</a>
                    <a href="/">Sobre Nós</a>
                    <a href="/">Contato</a>
                    <a href="/">Login</a>
                    <a href="/">Registro</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar