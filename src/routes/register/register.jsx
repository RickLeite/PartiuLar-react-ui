import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        const formData = new FormData(e.target);

        const nome = formData.get("username");
        const email = formData.get("email");
        const senha = formData.get("password");
        const telefone = formData.get("telefone");
        const genero = formData.get("genero");

        try {
            const res = await apiRequest.post("/auth/register", {
                nome,
                email,
                senha,
                telefone,
                genero,
            });

            if (res.status === 200 || res.status === 201) {
                setSuccess('Registro bem-sucedido!');
                console.log('Resposta da API:', res.data);

                navigate("/login");
            } else {
                setError("Erro ao registrar. Tente novamente.");
            }
        } catch (err) {
            console.error("Erro na requisição:", err);
            setError(err.response?.data?.message || "Erro desconhecido");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="registerPage">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Criar uma Conta</h1>  {success && <span>{success}</span>}
                    <input name="username" type="text" placeholder="Nome" />
                    <input name="username" type="text" placeholder="Nome" />
                    <input name="email" type="email" placeholder="Email" />
                    <input name="telefone" type="text" placeholder="Telefone" />
                    <input name="password" type="password" placeholder="Senha" />
                    <div className="genderSelection">
                        <input type="radio" id="male" name="genero" value="male" />
                        <label htmlFor="male">Masculino</label>
                        <input type="radio" id="female" name="genero" value="female" />
                        <label htmlFor="female">Feminino</label>
                        <input type="radio" id="other" name="genero" value="other" />
                        <label htmlFor="other">Outro</label>
                    </div>
                    <button disabled={isLoading}>
                        {isLoading ? "Registrando..." : "Registrar"}
                    </button>
                    {error && <span>{error}</span>}
                    <Link to="/login">Já tem uma conta?</Link>
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
};

export default Register;