import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Maximize, Bookmark, BookmarkCheck, X } from 'lucide-react';
import { useAuth } from '../../../BackEnd/Auth/AuthContext';
import './CardsStyle.css';

const DescuentoGame = () => {
    const { isLoggedIn } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const gameData = [
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
            copies: 1250000,
            discountId: null
        },
        {
            id: 2,
            title: "FIFA 24",
            description: "El mejor juego de fútbol",
            price: "39.99",
            rating: 4.5,
            image: "https://via.placeholder.com/280x160",
            category: "Deportes",
            publisher: "EA Sports",
            discounted: true,
            originalPrice: "59.99",
            copies: 980000,
            discountId: 1
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
            copies: 850000,
            discountId: null
        },
        {
            id: 4,
            title: "Call of Duty: Modern Warfare III",
            description: "Acción militar en primera persona",
            price: "39.99",
            rating: 4.6,
            image: "https://via.placeholder.com/280x160",
            category: "FPS",
            publisher: "Activision",
            discounted: true,
            originalPrice: "69.99",
            copies: 780000,
            discountId: 2
        },
        {
            id: 5,
            title: "Spider-Man 2",
            description: "Aventuras del hombre araña",
            price: "49.99",
            rating: 4.7,
            image: "https://via.placeholder.com/280x160",
            category: "Acción",
            publisher: "Sony",
            discounted: true,
            originalPrice: "69.99",
            copies: 720000,
            discountId: 3
        },
        {
            id: 6,
            title: "The Last of Us Part I",
            description: "Aventura post-apocalíptica",
            price: "29.99",
            rating: 4.9,
            image: "https://via.placeholder.com/280x160",
            category: "Acción/Aventura",
            publisher: "Sony",
            discounted: true,
            originalPrice: "59.99",
            copies: 450000,
            discountId: 4
        },
        {
            id: 7,
            title: "Red Dead Redemption 2",
            description: "Una aventura en el salvaje oeste",
            price: "45.99",
            rating: 4.8,
            image: "https://via.placeholder.com/280x160",
            category: "Acción/Aventura",
            publisher: "Rockstar Games",
            discounted: true,
            originalPrice: "69.99",
            copies: 680000,
            discountId: 5
        },
        {
            id: 8,
            title: "League of Legends",
            description: "El MOBA más popular del mundo",
            price: "0.00",
            rating: 4.5,
            image: "https://via.placeholder.com/280x160",
            category: "MOBA",
            publisher: "Riot Games",
            discounted: false,
            originalPrice: "0.00",
            copies: 1100000,
            discountId: null
        },
        {
            id: 9,
            title: "Fortnite",
            description: "Battle Royale popular",
            price: "0.00",
            rating: 4.4,
            image: "https://via.placeholder.com/280x160",
            category: "Battle Royale",
            publisher: "Epic Games",
            discounted: false,
            originalPrice: "0.00",
            copies: 950000,
            discountId: null
        },
        {
            id: 10,
            title: "Cyberpunk 2077",
            description: "RPG futurista de mundo abierto",
            price: "39.99",
            rating: 4.5,
            image: "https://via.placeholder.com/280x160",
            category: "RPG",
            publisher: "CD Projekt Red",
            discounted: true,
            originalPrice: "59.99",
            copies: 350000,
            discountId: 6
        }
    ];

    const discountedGames = gameData
    .filter(game => game.discounted)
    .sort((a, b) => {
        const discountA = (a.originalPrice - a.price) / a.originalPrice;
        const discountB = (b.originalPrice - b.price) / b.originalPrice;
        return discountB - discountA;
    })
    .slice(0, 5);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('gameFavorites');
        const savedPurchases = localStorage.getItem('gameBuy');
        
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
        if (savedPurchases) {
            try {
                const parsedPurchases = JSON.parse(savedPurchases);
                setPurchases(Array.isArray(parsedPurchases) ? parsedPurchases : []);
            } catch (e) {
                setPurchases([]);
            }
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
        localStorage.setItem('gameFavorites', JSON.stringify(newFavorites));
        
        if (!favorites.includes(gameId)) {
            showToast(`${game.title} se agregó a favoritos`);
        }
    };

    const handleBuy = (game) => {
        setSelectedGame(game);
        setShowModal(true);
    };

    const handlePurchaseConfirmation = () => {
        try {
            let existingPurchases = [];
            const savedPurchases = localStorage.getItem('gameBuy');
            
            if (savedPurchases) {
                try {
                    const parsed = JSON.parse(savedPurchases);
                    existingPurchases = Array.isArray(parsed) ? parsed : [];
                } catch (e) {
                    existingPurchases = [];
                }
            }
    
            if (!existingPurchases.includes(selectedGame.id)) {
                existingPurchases.push(selectedGame.id);
                
                localStorage.setItem('gameBuy', JSON.stringify(existingPurchases));
                
                showToast('¡Compra confirmada!');
            } else {
                showToast('¡Ya has comprado este juego!');
            }
            
            setShowModal(false);
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            showToast('Error al procesar la compra. Por favor, intenta nuevamente.');
            setShowModal(false);
        }
    };

    const handleGameInfo = (game) => {
        navigate(`/game/${game.id}`);
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
                                onClick={handlePurchaseConfirmation}
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