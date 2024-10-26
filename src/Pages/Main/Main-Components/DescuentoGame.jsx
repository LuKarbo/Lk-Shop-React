import { useState, useEffect } from 'react';
import { Maximize, Bookmark, BookmarkCheck, X } from 'lucide-react';
import './CardsStyle.css';

const DescuentoGame = () => {
    const [favorites, setFavorites] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const discountedGames = [
        { id: 1, title: "The Witcher 3", originalPrice: 59.99, price: 29.99, image: "https://via.placeholder.com/280x160", description: "Un épico juego de rol de mundo abierto", rating: 4.9, publisher: "CD Projekt Red", category: "RPG" },
        { id: 2, title: "Red Dead Redemption 2", originalPrice: 69.99, price: 45.99, image: "https://via.placeholder.com/280x160", description: "Una aventura en el salvaje oeste", rating: 4.8, publisher: "Rockstar Games", category: "Acción/Aventura" },
        { id: 3, title: "Cyberpunk 2077", originalPrice: 59.99, price: 39.99, image: "https://via.placeholder.com/280x160", description: "Una aventura futurista en Night City", rating: 4.5, publisher: "CD Projekt Red", category: "RPG" },
        { id: 4, title: "God of War", originalPrice: 49.99, price: 29.99, image: "https://via.placeholder.com/280x160", description: "Una épica aventura nórdica", rating: 4.9, publisher: "Sony", category: "Acción" },
        { id: 5, title: "Elden Ring", originalPrice: 59.99, price: 44.99, image: "https://via.placeholder.com/280x160", description: "Un desafiante juego de rol de acción", rating: 4.7, publisher: "FromSoftware", category: "RPG" }
    ];

    useEffect(() => {
        const savedFavorites = localStorage.getItem('discountGameFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const toggleFavorite = (gameId) => {
        const game = discountedGames.find(g => g.id === gameId);
        const newFavorites = favorites.includes(gameId)
            ? favorites.filter(id => id !== gameId)
            : [...favorites, gameId];
        
        setFavorites(newFavorites);
        localStorage.setItem('discountGameFavorites', JSON.stringify(newFavorites));
        
        if (!favorites.includes(gameId)) {
            showToast(`${game.title} se agregó a favoritos`);
        }
    };

    const handleBuy = (game) => {
        setSelectedGame(game);
        setShowModal(true);
    };

    const handleGameInfo = (game) => {
        setSelectedGame(game);
    };

    return (
        <div className="descuento-container">
            <h2>Juegos en Descuento</h2>
            <div className="descuento-games-grid">
                {discountedGames.map((game) => (
                    <div key={game.id} className="descuento-game-card">
                        <div className="descuento-game-image-container">
                            <img
                                src={game.image}
                                alt={game.title}
                                className="descuento-game-image"
                            />
                            <div className="descuento-discount-badge">
                                -{Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)}%
                            </div>
                        </div>
                        <div className="descuento-game-content">
                            <div className="descuento-game-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 className="descuento-game-title">{game.title}</h3>
                                    <Maximize 
                                        size={16} 
                                        className="descuento-search-icon"
                                        onClick={() => handleGameInfo(game)}
                                    />
                                </div>
                                <span className="descuento-game-rating">★ {game.rating}</span>
                            </div>
                            <p className="descuento-game-description">{game.description}</p>
                            <div className="descuento-game-details">
                                <span className="descuento-game-publisher">{game.publisher}</span>
                                <span className="descuento-game-category">{game.category}</span>
                            </div>
                            <div className="descuento-game-footer">
                                <div className="descuento-game-price-container">
                                    <span className="descuento-game-price">${game.price}</span>
                                    <span className="descuento-game-original-price">${game.originalPrice}</span>
                                </div>
                                <div className="descuento-button-group">
                                    <button
                                        onClick={() => toggleFavorite(game.id)}
                                        className={`descuento-button descuento-button-favorite ${favorites.includes(game.id) ? 'active' : ''}`}
                                        aria-label={favorites.includes(game.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                                    >
                                        {favorites.includes(game.id) ? (
                                            <BookmarkCheck size={20} />
                                        ) : (
                                            <Bookmark size={20} />
                                        )}
                                    </button>
                                    <button 
                                        className="descuento-button descuento-button-buy"
                                        onClick={() => handleBuy(game)}
                                    >
                                        Comprar
                                    </button>
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

export default DescuentoGame;