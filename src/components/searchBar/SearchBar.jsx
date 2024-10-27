import { useState } from "react";
import "./searchBar.scss";
import { useNavigate } from "react-router-dom";

const types = ["Alugar"];

function SearchBar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState({
        type: "Alugar",
        cidade: "",
        precoMin: "",
        precoMax: "",
    });

    const handleChange = (e) => {
        setQuery(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construir query string apenas com campos preenchidos
        const queryParams = new URLSearchParams();

        // Garantindo que a cidade seja formatada corretamente para a URL
        if (query.cidade) {
            const cidadeFormatada = query.cidade.trim().toLowerCase();
            queryParams.append("cidade", cidadeFormatada);
        }

        // Preços apenas se forem valores válidos
        if (query.precoMin && !isNaN(query.precoMin) && query.precoMin > 0) {
            queryParams.append("precoMin", query.precoMin);
        }
        if (query.precoMax && !isNaN(query.precoMax) && query.precoMax > 0) {
            queryParams.append("precoMax", query.precoMax);
        }

        // Log para debug
        console.log("URL de busca:", `/list?${queryParams.toString()}`);

        // Navegar para a página de listagem com os parâmetros
        navigate(`/list?${queryParams.toString()}`);
    };

    return (
        <div className="searchBar">
            <div className="type">
                {types.map((type) => (
                    <button
                        key={type}
                        className="active"
                    >
                        {type}
                    </button>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade (ex: Campinas)"
                    value={query.cidade}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="precoMin"
                    min={0}
                    max={10000}
                    placeholder="Preço Mínimo"
                    value={query.precoMin}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="precoMax"
                    min={0}
                    max={10000}
                    placeholder="Preço Máximo"
                    value={query.precoMax}
                    onChange={handleChange}
                />
                <button type="submit" className="searchButton">
                    <img src="/search.png" alt="Buscar" />
                </button>
            </form>
        </div>
    );
}

export default SearchBar;