import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
    const { currentUser, updateUser } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target);
        const { nome, email, senha, telefone, genero } = Object.fromEntries(formData);

        // Only include fields that have been changed
        const updateData = {};
        if (nome && nome !== currentUser.usuario.nome) updateData.nome = nome;
        if (email && email !== currentUser.usuario.email) updateData.email = email;
        if (senha) updateData.senha = senha;
        if (telefone && telefone !== currentUser.usuario.telefone) updateData.telefone = telefone;
        if (genero && genero !== currentUser.usuario.genero) updateData.genero = genero;
        if (avatar[0] && avatar[0] !== currentUser.usuario.avatar) updateData.avatar = avatar[0];

        try {
            const res = await apiRequest.put(`/users/${currentUser.usuario.id}`, updateData);

            // Update the user context with new data
            updateUser({
                ...currentUser,
                usuario: {
                    ...currentUser.usuario,
                    ...res.data
                }
            });

            navigate("/profile");
        } catch (err) {
            console.error("Erro ao atualizar perfil:", err);
            setError(err.response?.data?.message || "Erro ao atualizar perfil");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profileUpdatePage">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Atualizar Perfil</h1>
                    <div className="item">
                        <label htmlFor="nome">Nome</label>
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            defaultValue={currentUser.usuario.nome}
                            required
                        />
                    </div>
                    <div className="item">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={currentUser.usuario.email}
                            required
                        />
                    </div>
                    <div className="item">
                        <label htmlFor="telefone">Telefone</label>
                        <input
                            id="telefone"
                            name="telefone"
                            type="text"
                            defaultValue={currentUser.usuario.telefone}
                            required
                        />
                    </div>
                    <div className="item">
                        <label htmlFor="senha">Nova Senha</label>
                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            placeholder="Deixe em branco para manter a senha atual"
                        />
                    </div>
                    <div className="item">
                        <label>Gênero</label>
                        <div className="genderSelection">
                            <input
                                type="radio"
                                id="male"
                                name="genero"
                                value="male"
                                defaultChecked={currentUser.usuario.genero === "male"}
                            />
                            <label htmlFor="male">Masculino</label>

                            <input
                                type="radio"
                                id="female"
                                name="genero"
                                value="female"
                                defaultChecked={currentUser.usuario.genero === "female"}
                            />
                            <label htmlFor="female">Feminino</label>

                            <input
                                type="radio"
                                id="other"
                                name="genero"
                                value="other"
                                defaultChecked={currentUser.usuario.genero === "other"}
                            />
                            <label htmlFor="other">Outro</label>
                        </div>
                    </div>
                    <button disabled={isLoading}>
                        {isLoading ? "Atualizando..." : "Atualizar"}
                    </button>
                    {error && <span className="error">{error}</span>}
                </form>
            </div>
            <div className="sideContainer">
                <img
                    src={avatar[0] || currentUser.usuario.avatar || "/noavatar.jpg"}
                    alt=""
                    className="avatar"
                />
                <UploadWidget
                    uwConfig={{
                        cloudName: "lamadev",
                        uploadPreset: "estate",
                        multiple: false,
                        maxImageFileSize: 2000000,
                        folder: "avatars",
                    }}
                    setState={setAvatar}
                />
            </div>
        </div>
    );
}

export default ProfileUpdatePage;