import './Product.css';

const Product = ({ games = [], onBuy = () => {}, onFavorite = () => {} }) => {
    return (
        <div className="game-grid">
            {games.map((game) => (
                <div key={game.id} className={`game-card ${game.size}`}>
                    <div className="card-content">
                        <img
                            src={game.image}
                            alt={game.title}
                            className="game-image"
                            loading="lazy"
                        />
                        <div className="card-overlay">
                            <div className="game-info">
                                <div className="game-tags">
                                    <span className="price-tag">{game.price}</span>
                                    <span className="rating-tag">★ {game.rating}</span>
                                </div>
                                <h2>{game.title}</h2>
                                <p>{game.description}</p>
                                <div className="card-buttons">
                                    <button
                                        onClick={() => onBuy(game)}
                                        className="btn-primary"
                                    >
                                        Comprar
                                    </button>
                                    <button
                                        onClick={() => onFavorite(game)}
                                        className="btn-secondary"
                                    >
                                        ♥
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Product;