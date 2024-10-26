import { createContext, useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        console.log('pegando dados do form')
        const formData = new FormData(e.target);

        const email = formData.get("email");
        const senha = formData.get("senha");

        try {
            console.log('chamando API')
            const res = await apiRequest.post("/auth/login", {
                email,
                senha,
            });

            console.log('verificando status')

            if (res.status === 200 || res.status === 201) {

                const userData = res.data.usuario
                // Atualizando o usuário no contexto
                updateUser(res.data);

                console.log('Resposta da API:', userData);
                navigate("/");
            } else {
                setError("Erro ao logar. Tente novamente.");
            }

        } catch (err) {
            console.error('Erro ao fazer login:', err);
            setError(err.response?.data?.message || "Erro no login. Tente novamente.");
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
                        name="email"
                        required
                        minLength={3}
                        maxLength={100}
                        type="text"
                        placeholder="Email"
                    />
                    <input
                        name="senha"
                        type="password"
                        required
                        placeholder="Senha"
                    />
                    <button disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </button>
                    {error && <span className="error">{error}</span>}
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