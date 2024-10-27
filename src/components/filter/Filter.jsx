import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./filter.scss";

function Filter() {
    const navigate = useNavigate();
    const location = useLocation();

    // Estado inicial do filtro
    const [filter, setFilter] = useState({
        cidade: "",
        tipo: "alugar",
        propriedade: "",
        precoMin: "",
        precoMax: "",
    });

    // Buscar parâmetros da URL ao carregar
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlFilter = {
            cidade: params.get("cidade") || "",
            tipo: params.get("tipo") || "alugar",
            propriedade: params.get("propriedade") || "",
            precoMin: params.get("precoMin") || "",
            precoMax: params.get("precoMax") || "",
        };
        setFilter(urlFilter);
    }, [location.search]);

    // Atualiza um campo específico do filtro
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Aplica os filtros
    const handleSubmit = (e) => {
        e.preventDefault();

        // Constrói os parâmetros da URL
        const params = new URLSearchParams();

        // Adiciona apenas os parâmetros que têm valor
        Object.entries(filter).forEach(([key, value]) => {
            if (value) {
                params.append(key, value);
            }
        });

        // Navega para a mesma rota com os novos parâmetros
        navigate({
            pathname: location.pathname,
            search: params.toString()
        });
    };

    // Valores predefinidos para selects
    const propriedadeTypes = [
        { value: "", label: "Qualquer" },
        { value: "apartamento", label: "Apartamento" },
        { value: "casa", label: "Casa" },
        { value: "kitnet", label: "Kitnet" }
    ];

    return (
        <div className="filter">
            <h1>
                Pesquisa por: <b>{filter.cidade || "Todas as cidades"}</b>
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="top">
                    <div className="item">
                        <label htmlFor="cidade">Local</label>
                        <input
                            type="text"
                            id="cidade"
                            name="cidade"
                            placeholder="Local"
                            value={filter.cidade}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="bottom">
                    <div className="item">
                        <label htmlFor="type">Tipo</label>
                        <select
                            name="tipo"
                            id="tipo"
                            value={filter.tipo}
                            onChange={handleChange}
                        >
                            <option value="alugar">Alugar</option>
                        </select>
                    </div>
                    <div className="item">
                        <label htmlFor="propriedade">Propriedade</label>
                        <select
                            name="propriedade"
                            id="propriedade"
                            value={filter.propriedade}
                            onChange={handleChange}
                        >
                            {propriedadeTypes.map(tipo => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="item">
                        <label htmlFor="precoMin">Preço Min</label>
                        <input
                            type="number"
                            id="precoMin"
                            name="precoMin"
                            placeholder="Qualquer"
                            value={filter.precoMin}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                    <div className="item">
                        <label htmlFor="precoMax">Preço Max</label>
                        <input
                            type="number"
                            id="precoMax"
                            name="precoMax"
                            placeholder="Qualquer"
                            value={filter.precoMax}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                    <button type="submit">
                        <img src="/search.png" alt="Buscar" />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Filter;