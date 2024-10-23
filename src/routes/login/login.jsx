import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Login() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const formData = new FormData(e.target);

        const nome = formData.get("nome");
        const senha = formData.get("senha");

        try {
            const res = await apiRequest.post("/auth/login", {
                nome,
                senha,
            });

            updateUser(res.data)

            navigate("/");
        } catch (err) {
            setError(err.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="login">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Bem-vindo de volta</h1>
                    <input
                        name="nome"
                        required
                        minLength={3}
                        maxLength={20}
                        type="text"
                        placeholder="Nome de usuário"
                    />
                    <input
                        name="senha"
                        type="senha"
                        required
                        placeholder="Senha"
                    />
                    <button disabled={isLoading}>Entrar</button>
                    {error && <span>{error}</span>}
                    <Link to="/register">Você não tem uma conta?</Link>
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default Login;