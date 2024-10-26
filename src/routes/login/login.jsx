import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Pega a URL de redirecionamento se existir
    const from = location.state?.from?.pathname || "/";

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target);
        const email = formData.get("email");
        const senha = formData.get("senha");

        try {
            const res = await apiRequest.post("/auth/login", {
                email,
                senha,
            });

            if (res.status === 200 || res.status === 201) {
                // Garante que estamos salvando o token
                const userData = {
                    ...res.data,
                    token: res.data.token || res.headers['authorization']?.split(' ')[1]
                };

                localStorage.setItem('user', JSON.stringify(userData));
                updateUser(userData);
                navigate(location.state?.from || "/");
            }
        } catch (err) {
            console.error("Login error:", err);

            if (err.response?.status === 400) {
                setError("Email ou senha incorretos");
            } else if (err.response?.status === 404) {
                setError("Usuário não encontrado");
            } else if (err.response?.status === 429) {
                setError("Muitas tentativas. Tente novamente mais tarde");
            } else if (err.response?.status === 401) {
                setError("Não autorizado. Verifique suas credenciais.");
            } else {
                setError("Erro ao fazer login. Tente novamente.");
            }

            // Limpa o localStorage em caso de erro
            localStorage.removeItem('user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="formContainer">
                <form onSubmit={handleSubmit} noValidate>
                    <h1>Bem-vindo de volta</h1>
                    <div className="inputGroup">
                        <input
                            name="email"
                            required
                            minLength={3}
                            maxLength={100}
                            type="email"
                            placeholder="Email"
                            disabled={isLoading}
                            autoComplete="email"
                            autoFocus
                            aria-label="Email"
                        />
                    </div>
                    <div className="inputGroup">
                        <input
                            name="senha"
                            type="password"
                            required
                            placeholder="Senha"
                            disabled={isLoading}
                            minLength={3}
                            autoComplete="current-password"
                            aria-label="Senha"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={isLoading ? 'loading' : ''}
                        aria-busy={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </button>
                    {error && (
                        <span className="error" role="alert" aria-live="polite">
                            {error}
                        </span>
                    )}
                    <div className="links">
                        <Link
                            to="/register"
                            className="registerLink"
                            tabIndex={isLoading ? -1 : 0}
                        >
                            Você não tem uma conta?
                        </Link>
                        <Link
                            to="/forgot-password"
                            className="forgotPassword"
                            tabIndex={isLoading ? -1 : 0}
                        >
                            Esqueceu sua senha?
                        </Link>
                    </div>
                </form>
            </div>
            <div className="imgContainer">
                <div className="overlay"></div>
                <img
                    src="/bg.png"
                    alt="Background decorativo"
                    loading="eager"
                />
            </div>
        </div>
    );
}

export default Login;