import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item }) {
    let imageUrl;

    try {
        const parsedImages = JSON.parse(item.img);
        console.log("Parsed images:", parsedImages);
        imageUrl = Array.isArray(parsedImages) ? parsedImages[0] : item.img;
    } catch (e) {
        console.error("Error parsing image JSON:", e);
        imageUrl = item.img;
    }

    return (
        <div className="card">
            <Link to={`/${item.id}`} className="imageContainer">
                <img src={imageUrl} alt="" />
            </Link>
            <div className="textContainer">
                <h2 className="title">
                    <Link to={`/${item.id}`}>{item.title}</Link>
                </h2>
                <p className="address">
                    <img src="/pin.png" alt="" />
                    <span>{item.address}</span>
                </p>
                <p className="price">$ {item.price}</p>
                <div className="bottom">
                    <div className="features">
                        <div className="feature">
                            <img src="/bed.png" alt="" />
                            <span>{item.bedroom} quarto</span>
                        </div>
                        <div className="feature">
                            <img src="/bath.png" alt="" />
                            <span>{item.bathroom} banheiro</span>
                        </div>
                    </div>
                    <div className="icons">
                        <div className="icon">
                            <img src="/save.png" alt="" />
                        </div>
                        <div className="icon">
                            <img src="/chat.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;