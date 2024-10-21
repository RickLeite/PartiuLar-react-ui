import "./filter.scss";

function Filter() {
    return (
        <div className="filter">
            <h1>
                Pesquisa por: <b>Campinas</b>
            </h1>
            <div className="top">
                <div className="item">
                    <label htmlFor="city">Local</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        placeholder="Local"
                    />
                </div>
            </div>
            <div className="bottom">
                <div className="item">
                    <label htmlFor="type">Tipo</label>
                    <select name="type" id="type">
                        <option value="rent">Alugar</option>
                    </select>
                </div>
                <div className="item">
                    <label htmlFor="property">Propriedade</label>
                    <select name="property" id="property">
                        <option value="">qualquer</option>
                        <option value="apartment">Apartamento</option>
                        <option value="house">Casa</option>
                    </select>
                </div>
                <div className="item">
                    <label htmlFor="minPrice">Preço Min</label>
                    <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        placeholder="qualquer"
                    />
                </div>
                <div className="item">
                    <label htmlFor="maxPrice">Preço Max</label>
                    <input
                        type="text"
                        id="maxPrice"
                        name="maxPrice"
                        placeholder="qualquer"
                    />
                </div>
                <div className="item">
                    <label htmlFor="bedroom">quarto</label>
                    <input
                        type="text"
                        id="bedroom"
                        name="bedroom"
                        placeholder="qualquer"
                    />
                </div>
                <button>
                    <img src="/search.png" alt="" />
                </button>
            </div>
        </div>
    );
}

export default Filter;