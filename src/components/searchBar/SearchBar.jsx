import { useState } from "react";
import "./searchBar.scss";

const types = ["Alugar"];

function SearchBar() {
    const [query, setQuery] = useState({
        type: "Alugar",
        location: "",
        minPrice: 0,
        maxPrice: 0,
    });

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
            <form>
                <input type="text" name="location" placeholder="Local" />
                <input
                    type="number"
                    name="minPrice"
                    min={0}
                    max={10000000}
                    placeholder="Preço Min"
                />
                <input
                    type="number"
                    name="maxPrice"
                    min={0}
                    max={10000000}
                    placeholder="Preço Max"
                />
                <button>
                    <img src="/search.png" alt="" />
                </button>
            </form>
        </div>
    );
}

export default SearchBar;