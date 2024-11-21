import { useState, useContext } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function NewPostPage() {
    const [descricao, setDescricao] = useState("");
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCEP, setIsFetchingCEP] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Estados para os campos de endereço
    const [endereco, setEndereco] = useState("");
    const [cidade, setCidade] = useState("Campinas");
    const [estado, setEstado] = useState("SP");

    const formatCEP = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    const fetchAddressData = async (cep) => {
        const cleanCEP = cep.replace(/\D/g, '');
        if (cleanCEP.length !== 8) return;

        setIsFetchingCEP(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
            const data = await response.json();

            if (!data.erro) {
                const enderecoFormatado = `${data.logradouro}${data.bairro ? `, ${data.bairro}` : ''}`;
                setEndereco(enderecoFormatado);
                setCidade(data.localidade || "Campinas");
                setEstado(data.uf || "SP");
            }
        } catch (err) {
            console.error("Erro ao buscar CEP:", err);
        } finally {
            setIsFetchingCEP(false);
        }
    };

    const handleCEPChange = async (e) => {
        const input = e.target;
        const formattedCEP = formatCEP(input.value);
        input.value = formattedCEP;

        if (formattedCEP.length === 9) {
            await fetchAddressData(formattedCEP);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target);
        const inputs = Object.fromEntries(formData);

        try {
            if (!currentUser) {
                throw new Error("Você precisa estar logado para criar um post");
            }

            // Validate required fields
            const requiredFields = ['titulo', 'preco', 'endereco', 'cidade', 'estado', 'cep'];
            for (const field of requiredFields) {
                if (!inputs[field]) {
                    throw new Error(`Campo ${field} é obrigatório`);
                }
            }

            // Validate price
            if (isNaN(inputs.preco) || inputs.preco <= 0) {
                throw new Error("Preço inválido");
            }

            // Validate CEP format
            const cepRegex = /^\d{5}-?\d{3}$/;
            if (!cepRegex.test(inputs.cep)) {
                throw new Error("Formato de CEP inválido");
            }

            // Prepare data according to Prisma schema
            const postData = {
                titulo: inputs.titulo,
                preco: parseInt(inputs.preco),
                descricao: descricao,
                img: JSON.stringify(images),
                endereco: inputs.endereco,
                cidade: inputs.cidade,
                estado: inputs.estado,
                cep: inputs.cep,
                tipo: inputs.tipo || "aluguel",
                propriedade: inputs.propriedade || "apartamento"
            };

            const res = await apiRequest.post("/posts", postData);

            if (res.data.warnings) {
                console.warn('Avisos:', res.data.warnings);
            }

            navigate("/" + res.data.id);
        } catch (err) {
            console.error('Erro ao criar post:', err);
            setError(err.response?.data?.message || err.message || "Erro ao criar post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    if (!currentUser) {
        navigate("/login");
        return null;
    }

    return (
        <div className="newPostPage">
            <div className="formContainer">
                <h1>Criar Novo Anúncio</h1>
                <div className="wrapper">
                    <form onSubmit={handleSubmit}>
                        <div className="item">
                            <label htmlFor="titulo">Título</label>
                            <input id="titulo" name="titulo" type="text" required />
                        </div>
                        <div className="item">
                            <label htmlFor="preco">Preço (R$)</label>
                            <input
                                id="preco"
                                name="preco"
                                type="number"
                                min="1"
                                required
                            />
                        </div>
                        <div className="item">
                            <label htmlFor="tipo">Tipo</label>
                            <select name="tipo" id="tipo">
                                <option value="aluguel">Aluguel</option>
                            </select>
                        </div>
                        <div className="item">
                            <label htmlFor="propriedade">Tipo de Propriedade</label>
                            <select name="propriedade" id="propriedade">
                                <option value="apartamento">Apartamento</option>
                                <option value="casa">Casa</option>
                                <option value="kitnet">Kitnet</option>
                                <option value="republica">República</option>
                            </select>
                        </div>
                        <div className="item">
                            <label htmlFor="cep">CEP</label>
                            <input
                                id="cep"
                                name="cep"
                                type="text"
                                required
                                maxLength="9"
                                placeholder="12345-678"
                                onChange={handleCEPChange}
                                disabled={isFetchingCEP}
                            />
                        </div>
                        <div className="item">
                            <label htmlFor="endereco">Endereço</label>
                            <input
                                id="endereco"
                                name="endereco"
                                type="text"
                                required
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                disabled={isFetchingCEP}
                            />
                        </div>
                        <div className="item">
                            <label htmlFor="cidade">Cidade</label>
                            <input
                                id="cidade"
                                name="cidade"
                                type="text"
                                required
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                disabled={isFetchingCEP}
                            />
                        </div>
                        <div className="item">
                            <label htmlFor="estado">Estado</label>
                            <input
                                id="estado"
                                name="estado"
                                type="text"
                                required
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                disabled={isFetchingCEP}
                            />
                        </div>
                        <div className="item description">
                            <label htmlFor="descricao">Descrição</label>
                            <ReactQuill
                                theme="snow"
                                onChange={setDescricao}
                                value={descricao}
                            />
                        </div>
                        <button
                            type="submit"
                            className="sendButton"
                            disabled={isLoading || !descricao || isFetchingCEP}
                        >
                            {isLoading ? "Publicando..." : "Publicar Anúncio"}
                        </button>
                        {error && <span className="error">{error}</span>}
                    </form>
                </div>
            </div>
            <div className="sideContainer">
                {images.map((url, index) => (
                    <div key={index} className="imageContainer">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            onError={(e) => e.target.classList.add('error')}
                        />
                        <button
                            onClick={() => handleRemoveImage(index)}
                            className="removeButton"
                        >
                            Remover
                        </button>
                    </div>
                ))}
                <UploadWidget
                    uwConfig={{
                        cloudName: "lamadev",
                        uploadPreset: "estate",
                        multiple: true,
                        maxImageFileSize: 2000000,
                        folder: "properties",
                    }}
                    setState={setImages}
                />
            </div>
        </div>
    );
}

export default NewPostPage;