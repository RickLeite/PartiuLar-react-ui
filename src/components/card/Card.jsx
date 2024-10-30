import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item }) {
    // Função para extrair a primeira imagem do array
    const getFirstImage = (imgField) => {
        try {
            // Se já for uma string simples, retorna ela
            if (typeof imgField === 'string' && !imgField.startsWith('[')) {
                return imgField;
            }

            // Se for um array em formato string, faz o parse
            const imgArray = typeof imgField === 'string'
                ? JSON.parse(imgField)
                : imgField;

            // Retorna a primeira imagem do array ou o placeholder
            return Array.isArray(imgArray) && imgArray.length > 0
                ? imgArray[0]
                : '/placeholder-house.jpg';
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
            return '/placeholder-house.jpg';
        }
    };

    // Extrai a primeira imagem ou usa o placeholder
    const imageUrl = item.img ? getFirstImage(item.img) : '/placeholder-house.jpg';

    return (
        <div className="card">
            <Link to={`/${item.id}`} className="imageContainer">
                <img src={imageUrl} alt={item.titulo || "Anúncio"} />
            </Link>
            <div className="textContainer">
                <h2 className="titulo">
                    <Link to={`/${item.id}`}>{item.titulo || "Título não disponível"}</Link>
                </h2>
                <p className="endereco">
                    <img src="/pin.png" alt="Location Pin" />
                    <span>{item.endereco || "Endereço não disponível"}</span>
                </p>
                <p className="preco">$ {item.preco?.toLocaleString('pt-BR') || "Preço não disponível"}</p>
                <div className="bottom">
                    <div className="features">
                        {item.bedroom !== undefined && (
                            <div className="feature">
                                <img src="/bed.png" alt="Bedroom Icon" />
                                <span>{item.bedroom} quarto{item.bedroom !== 1 ? "s" : ""}</span>
                            </div>
                        )}
                        {item.bathroom !== undefined && (
                            <div className="feature">
                                <img src="/bath.png" alt="Bathroom Icon" />
                                <span>{item.bathroom} banheiro{item.bathroom !== 1 ? "s" : ""}</span>
                            </div>
                        )}
                    </div>
                    <div className="icons">
                        <div className="icon">
                            <img src="/save.png" alt="Save Icon" />
                        </div>
                        <div className="icon">
                            <img src="/chat.png" alt="Chat Icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;