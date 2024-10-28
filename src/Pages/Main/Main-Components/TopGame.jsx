import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize, Bookmark, BookmarkCheck, X } from 'lucide-react';
import { useAuth } from '../../../BackEnd/Auth/AuthContext';
import './CardsStyle.css';

const TopGame = () => {
    const { isLoggedIn } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const topGames = [
        {
            id: 1,
            title: "GTA V",
            description: "Acción y aventura en Los Santos",
            price: "29.99",
            rating: 4.8,
            image: "https://via.placeholder.com/280x160",
            category: "Acción/Aventura",
            publisher: "Rockstar Games",
            discounted: false,
            originalPrice: "29.99",
            copies: 1250,
            discountId: null
        },
        {
            id: 2,
            title: "FIFA 24",
            description: "El mejor juego de fútbol",
            price: "59.99",
            rating: 4.5,
            image: "https://via.placeholder.com/280x160",
            category: "Deportes",
            publisher: "EA Sports",
            discounted: false,
            originalPrice: "59.99",
            copies: 980,
            discountId: null
        },
        {
            id: 3,
            title: "Minecraft",
            description: "Construye tu propio mundo",
            price: "26.99",
            rating: 4.9,
            image: "https://via.placeholder.com/280x160",
            category: "Aventura",
            publisher: "Mojang",
            discounted: false,
            originalPrice: "26.99",
            copies: 850,
            discountId: null
        },
        {
            id: 4,
            title: "Call of Duty",
            description: "Acción militar en primera persona",
            price: "69.99",
            rating: 4.6,
            image: "https://via.placeholder.com/280x160",
            category: "FPS",
            publisher: "Activision",
            discounted: false,
            originalPrice: "69.99",
            copies: 780,
            discountId: null
        },
        {
            id: 5,
            title: "Spider-Man 2",
            description: "Aventuras del hombre araña",
            price: "69.99",
            rating: 4.7,
            image: "https://via.placeholder.com/280x160",
            category: "Acción",
            publisher: "Sony",
            discounted: false,
            originalPrice: "69.99",
            copies: 720,
            discountId: null
        }
    ];

    useEffect(() => {
        const savedFavorites = localStorage.getItem('topGameFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const toggleFavorite = (gameId) => {
        const game = topGames.find(g => g.id === gameId);
        const newFavorites = favorites.includes(gameId)
            ? favorites.filter(id => id !== gameId)
            : [...favorites, gameId];
        
        setFavorites(newFavorites);
        localStorage.setItem('topGameFavorites', JSON.stringify(newFavorites));
        
        if (!favorites.includes(gameId)) {
            showToast(`${game.title} se agregó a favoritos`);
        }
    };

    const handleBuy = (game) => {
        setSelectedGame(game);
        setShowModal(true);
    };

    const handleGameInfo = (game) => {
        navigate(`/game/${game.id}`);
    };

    return (
        <div className="topgame-container">
            <h2>Juegos Más Comprados</h2>
            <div className="topgame-games-grid">
                {topGames.map((game) => (
                    <div key={game.id} className="topgame-game-card">
                        <div className="topgame-game-image-container">
                            <img
                                src={game.image}
                                alt={game.title}
                                className="topgame-game-image"
                            />
                            <div className="topgame-sales-badge">
                                {game.sales} ventas
                            </div>
                        </div>
                        <div className="topgame-game-content">
                            <div className="topgame-game-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 className="topgame-game-title">{game.title}</h3>
                                    <Maximize 
                                        size={16} 
                                        className="topgame-search-icon"
                                        onClick={() => handleGameInfo(game)}
                                    />
                                </div>
                                <span className="topgame-game-rating">★ {game.rating}</span>
                            </div>
                            <p className="topgame-game-description">{game.description}</p>
                            <div className="topgame-game-details">
                                <span className="topgame-game-publisher">{game.publisher}</span>
                                <span className="topgame-game-category">{game.category}</span>
                            </div>
                            <div className="topgame-game-footer">
                                <div className="topgame-game-price-container">
                                    <span className="topgame-game-price">${game.price}</span>
                                </div>
                                <div className="topgame-button-group">
                                    {isLoggedIn? (
                                        <>
                                            <button
                                                onClick={() => toggleFavorite(game.id)}
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
                                                onClick={() => handleBuy(game)}
                                            >
                                                Comprar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => showToast('Debe de estar Logeado para agregar a Favoritos')}
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
                ))}
            </div>

            {/* Purchase/Info Modal */}
            {showModal && selectedGame && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Confirmar Compra</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-game-info">
                                <img 
                                    src={selectedGame.image} 
                                    alt={selectedGame.title} 
                                    className="modal-game-image"
                                />
                                <div className="modal-game-details">
                                    <h3>{selectedGame.title}</h3>
                                    <p>{selectedGame.description}</p>
                                    <p>Publicador: {selectedGame.publisher}</p>
                                    <p>Categoría: {selectedGame.category}</p>
                                    <p className="modal-game-price">
                                        Precio: ${selectedGame.price}
                                        <span className="game-original-price"> 
                                            ${selectedGame.originalPrice}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="button button-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="button button-buy"
                                onClick={() => {
                                    alert('Compra confirmada!');
                                    setShowModal(false);
                                }}
                            >
                                Confirmar Compra
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`contact-toast ${toast ? 'contact-toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default TopGame;