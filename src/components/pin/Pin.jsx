import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
    // Converter as strings para números
    const lat = parseFloat(item.latitude);
    const lng = parseFloat(item.longitude);

    // Verifica se as coordenadas são válidas
    if (isNaN(lat) || isNaN(lng)) return null;

    let imageUrl;
    try {
        const images = Array.isArray(item.img) ? item.img : JSON.parse(item.img);
        imageUrl = images && images.length > 0 ? images[0] : '/placeholder-house.jpg';
    } catch (e) {
        imageUrl = '/placeholder-house.jpg';
    }

    return (
        <Marker position={[lat, lng]}>
            <Popup>
                <div className="popupContainer">
                    <img src={imageUrl} alt={item.titulo} />
                    <div className="textContainer">
                        <Link to={`/${item.id}`}>{item.titulo}</Link>
                        <span>{item.endereco}</span>
                        <b>R$ {item.preco}</b>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

export default Pin;