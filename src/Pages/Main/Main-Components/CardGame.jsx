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
        navigate(`/game/${game.id_game}`);
    };
    const price = parseFloat(game.precio_original);
    return (
        <div className={`${variant}-game-card`}>
            <div className={`${variant}-game-image-container`}>
                <img
                    src={game.gameBanner || 'https://via.placeholder.com/280x160'}
                    alt={game.game_name}
                    className={`${variant}-game-image`}
                />
                {variant === 'descuento' && (
                    <div className="descuento-discount-badge">
                        -{Math.round(game.descuento_porcentaje)}%
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
                        <h3 className={`${variant}-game-title`}>{game.game_name}</h3>
                        <Maximize 
                            size={16} 
                            className={`${variant}-search-icon`}
                            onClick={() => handleGameInfo(game)}
                        />
                    </div>
                    <span className={`${variant}-game-rating`}>★ {parseFloat(game.puntaje)}</span>
                </div>
                <p className={`${variant}-game-description`}>{game.game_description}</p>
                <div className={`${variant}-game-details`}>
                    <span className={`${variant}-game-publisher`}>{game.editor_nombre}</span>
                    <span className={`${variant}-game-category`}>{game.categorias}</span>
                </div>
                <div className={`${variant}-game-footer`}>
                    <div className={`${variant}-game-price-container`}>
                    {
                        variant === 'descuento' ? (
                            <>
                                <span className={`${variant}-game-price`}>${(price - (price * (game.descuento_porcentaje / 100))).toFixed(2)}</span>
                                <span className={`${variant}-game-original-price`}>${price}</span>
                            </>
                        ) : (
                            <span className={`${variant}-game-price`}>${price}</span>
                        )
                    }

                    </div>
                    <div className={`${variant}-button-group`}>
                        {isLoggedIn ? (
                            purchases.includes(game.id_game) ? (
                                <Link 
                                    to="/mylibrary"
                                    className="product-button product-button-library"
                                >
                                    En la Biblioteca
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => onFavoriteToggle(game.id_game)}
                                        className={`product-button product-button-favorite ${favorites.includes(game.id_game) ? 'active' : ''}`}
                                        aria-label={favorites.includes(game.id_game) ? "Quitar de favoritos" : "Añadir a favoritos"}
                                    >
                                        {favorites.includes(game.id_game) ? (
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