// src/components/ErrorBoundary/ErrorBoundary.jsx
import { useRouteError, useNavigate, Link } from "react-router-dom";
import "./errorBoundary.scss";

function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();

    // Função para tentar novamente
    const handleRetry = () => {
        navigate(0); // Recarrega a página atual
    };

    // Função para voltar à página anterior
    const handleGoBack = () => {
        navigate(-1);
    };

    // Diferentes layouts baseados no tipo de erro
    if (error.status === 401) {
        return (
            <div className="errorPage">
                <div className="errorContent">
                    <img src="/error-401.png" alt="Não autorizado" />
                    <h1>Acesso Não Autorizado</h1>
                    <p>Você precisa estar logado para acessar esta página.</p>
                    <div className="errorActions">
                        <Link to="/login" className="primaryButton">
                            Fazer Login
                        </Link>
                        <button onClick={handleGoBack} className="secondaryButton">
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error.status === 404) {
        return (
            <div className="errorPage">
                <div className="errorContent">
                    <img src="/error-404.png" alt="Página não encontrada" />
                    <h1>Página Não Encontrada</h1>
                    <p>O conteúdo que você procura não existe ou foi removido.</p>
                    <div className="errorActions">
                        <Link to="/" className="primaryButton">
                            Página Inicial
                        </Link>
                        <button onClick={handleGoBack} className="secondaryButton">
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Erro padrão para outros casos
    return (
        <div className="errorPage">
            <div className="errorContent">
                <img src="/error-generic.png" alt="Erro" />
                <h1>Ops! Algo deu errado</h1>
                <p>
                    {error.message ||
                        "Desculpe, ocorreu um erro inesperado. Por favor, tente novamente."}
                </p>
                <div className="errorActions">
                    <button onClick={handleRetry} className="primaryButton">
                        Tentar Novamente
                    </button>
                    <Link to="/" className="secondaryButton">
                        Página Inicial
                    </Link>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <div className="errorDetails">
                        <pre>{error.stack}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ErrorBoundary;