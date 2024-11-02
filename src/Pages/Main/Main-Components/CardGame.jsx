import { useNavigate, Link } from 'react-router-dom';
import { Maximize, Bookmark, BookmarkCheck} from 'lucide-react';
import './CardsStyle.css';

const CardGame = ({ 
    game, 
    variant, 
    isLoggedIn, 
    favorites, 
    purchases, 
    onFavoriteToggle, 
    onBuy, 
    showToast 
}) => {
    const navigate = useNavigate();

    const handleGameInfo = (game) => {
        navigate(`/game/${game.id}`);
    };

    return (
        <div className={`${variant}-game-card`}>
            <div className={`${variant}-game-image-container`}>
                <img
                    src={game.image}
                    alt={game.title}
                    className={`${variant}-game-image`}
                />
                {variant === 'descuento' && (
                    <div className="descuento-discount-badge">
                        -{Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)}%
                    </div>
                )}
                {variant === 'topgame' && (
                    <div className="topgame-sales-badge">
                        Top en ventas!
                    </div>
                )}
            </div>
            <div className={`${variant}-game-content`}>
                <div className={`${variant}-game-header`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 className={`${variant}-game-title`}>{game.title}</h3>
                        <Maximize 
                            size={16} 
                            className={`${variant}-search-icon`}
                            onClick={() => handleGameInfo(game)}
                        />
                    </div>
                    <span className={`${variant}-game-rating`}>★ {game.rating}</span>
                </div>
                <p className={`${variant}-game-description`}>{game.description}</p>
                <div className={`${variant}-game-details`}>
                    <span className={`${variant}-game-publisher`}>{game.publisher}</span>
                    <span className={`${variant}-game-category`}>{game.category}</span>
                </div>
                <div className={`${variant}-game-footer`}>
                    <div className={`${variant}-game-price-container`}>
                        <span className={`${variant}-game-price`}>${game.price}</span>
                        {variant === 'descuento' && (
                            <span className={`${variant}-game-original-price`}>
                                ${game.originalPrice}
                            </span>
                        )}
                    </div>
                    <div className={`${variant}-button-group`}>
                        {isLoggedIn ? (
                            purchases.includes(game.id) ? (
                                <Link 
                                    to="/mylibrary"
                                    className="product-button product-button-library"
                                >
                                    En la Biblioteca
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => onFavoriteToggle(game.id)}
                                        className={`product-button product-button-favorite ${favorites.includes(game.id) ? 'active' : ''}`}
                                        aria-label={favorites.includes(game.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                                    >
                                        {favorites.includes(game.id) ? (
                                            <BookmarkCheck size={20} />
                                        ) : (
                                            <Bookmark size={20} />
                                        )}
                                    </button>
                                    <button 
                                        className="product-button product-button-buy"
                                        onClick={() => onBuy(game)}
                                    >
                                        Comprar
                                    </button>
                                </>
                            )
                        ) : (
                            <>
                                <button
                                    onClick={() => showToast('Debe de estar Logeado para agregar a Favoritos')}
                                    className="product-button product-button-favorite"
                                >
                                    <Bookmark size={20} />
                                </button>
                                <button 
                                    className="product-button product-button-buy"
                                    onClick={() => showToast('Debe de estar Logeado para comprar')}
                                >
                                    Comprar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardGame;