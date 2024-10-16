import './GameCard.css';

const GameCard = ({ title, price }) => (
    <div className="game-card">
        <img 
            src="https://via.placeholder.com/500x200" 
            alt="Juego" 
            className="card-img" 
        />
        <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">Descripción breve del juego. Aquí puedes incluir más detalles sobre el juego.</p>
            <div className="price">${price}</div>
            <button className="btn btn-primary">Comprar Ahora</button>
        </div>
    </div>
);

export default GameCard;
