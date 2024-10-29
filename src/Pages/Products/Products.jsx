import { useState, useEffect } from 'react';
import { Search, Bookmark, BookmarkCheck, X, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import './Products.css';

const Products = () => {
    const { isLoggedIn } = useAuth();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [publisher, setPublisher] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [onlyDiscounted, setOnlyDiscounted] = useState(false);
    const [filteredGames, setFilteredGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const games_list = [
        {
            id: 1,
            title: "GTA V",
            description: "Acción y aventura en Los Santos",
            price: "29.99",
            rating: 4.8,
            image: "https://via.placeholder.com/800x600",
            category: "Acción/Aventura",
            publisher: "Rockstar Games",
            discounted: false,
            originalPrice: "29.99",
            copies: 1250000
        },
        {
            id: 2,
            title: "FIFA 24",
            description: "El mejor juego de fútbol",
            price: "39.99",
            rating: 4.5,
            image: "https://via.placeholder.com/800x600",
            category: "Deportes",
            publisher: "EA Sports",
            discounted: true,
            originalPrice: "59.99",
            copies: 980000
        },
        {
            id: 3,
            title: "Minecraft",
            description: "Construye tu propio mundo",
            price: "26.99",
            rating: 4.9,
            image: "https://via.placeholder.com/800x600",
            category: "Aventura",
            publisher: "Mojang",
            discounted: false,
            originalPrice: "26.99",
            copies: 850000
        },
        {
            id: 4,
            title: "Call of Duty: Modern Warfare III",
            description: "Acción militar en primera persona",
            price: "39.99",
            rating: 4.6,
            image: "https://via.placeholder.com/800x600",
            category: "FPS",
            publisher: "Activision",
            discounted: true,
            originalPrice: "69.99",
            copies: 780000
        },
        {
            id: 5,
            title: "Spider-Man 2",
            description: "Aventuras del hombre araña",
            price: "49.99",
            rating: 4.7,
            image: "https://via.placeholder.com/800x600",
            category: "Acción",
            publisher: "Sony",
            discounted: true,
            originalPrice: "69.99",
            copies: 720000
        },
        {
            id: 6,
            title: "The Last of Us Part I",
            description: "Aventura post-apocalíptica",
            price: "29.99",
            rating: 4.9,
            image: "https://via.placeholder.com/800x600",
            category: "Acción/Aventura",
            publisher: "Sony",
            discounted: true,
            originalPrice: "59.99",
            copies: 450000
        },
        {
            id: 7,
            title: "Red Dead Redemption 2",
            description: "Una aventura en el salvaje oeste",
            price: "45.99",
            rating: 4.8,
            image: "https://via.placeholder.com/800x600",
            category: "Acción/Aventura",
            publisher: "Rockstar Games",
            discounted: true,
            originalPrice: "69.99",
            copies: 680000
        },
        {
            id: 8,
            title: "League of Legends",
            description: "El MOBA más popular del mundo",
            price: "0.00",
            rating: 4.5,
            image: "https://via.placeholder.com/800x600",
            category: "MOBA",
            publisher: "Riot Games",
            discounted: false,
            originalPrice: "0.00",
            copies: 1100000
        },
        {
            id: 9,
            title: "Fortnite",
            description: "Battle Royale popular",
            price: "0.00",
            rating: 4.4,
            image: "https://via.placeholder.com/800x600",
            category: "Battle Royale",
            publisher: "Epic Games",
            discounted: false,
            originalPrice: "0.00",
            copies: 950000
        },
        {
            id: 10,
            title: "Cyberpunk 2077",
            description: "RPG futurista de mundo abierto",
            price: "39.99",
            rating: 4.5,
            image: "https://via.placeholder.com/800x600",
            category: "RPG",
            publisher: "CD Projekt Red",
            discounted: true,
            originalPrice: "59.99",
            copies: 350000
        }
    ];

    useEffect(() => {
        const savedFavorites = localStorage.getItem('gameFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
        setFilteredGames(games_list);
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const toggleFavorite = (gameId) => {
        const game = games_list.find(g => g.id === gameId);
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

    const applyFilters = () => {
        const newFilteredGames = games_list.filter(game => {
            const searchMatch = !search || 
                game.title.toLowerCase().includes(search.toLowerCase()) ||
                game.description.toLowerCase().includes(search.toLowerCase()
        );
        const categoryMatch = !category || game.category === category;
        const publisherMatch = !publisher || game.publisher === publisher;
        const priceMatch = !maxPrice || parseFloat(game.price) <= parseFloat(maxPrice);
        const discountMatch = !onlyDiscounted || game.discounted;

        return searchMatch && categoryMatch && publisherMatch && priceMatch && discountMatch;
    });

        setFilteredGames(newFilteredGames);
    };

    useEffect(() => {
        applyFilters();
    }, [search, category, publisher, maxPrice, onlyDiscounted]);

    return (
        <div className="product-container">
            <div className="product-search-container">
                <Search className="product-search-icon" size={20} />
                <input
                type="text"
                placeholder="Buscar juegos..."
                className="product-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="product-filters-grid">
                <select
                className="product-filter-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    <option value="Aventura">Aventura</option>
                    <option value="RPG">RPG</option>
                    <option value="Acción">Acción</option>
                </select>

                <select
                className="product-filter-select"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                >
                    <option value="">Todos los editores</option>
                    <option value="Ubisoft">Ubisoft</option>
                    <option value="EA">EA</option>
                    <option value="Nintendo">Nintendo</option>
                </select>

                <input
                type="number"
                placeholder="Precio máximo"
                className="product-filter-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                />

                <label className="product-filter-checkbox">
                    <input
                        type="checkbox"
                        checked={onlyDiscounted}
                        onChange={(e) => setOnlyDiscounted(e.target.checked)}
                    />
                    <span className="checkbox-label">Solo ofertas</span>
                </label>
            </div>

            {filteredGames.length === 0 ? (
                <div className="product-no-results">
                    <p>No se encontraron juegos que coincidan con los filtros seleccionados.</p>
                    <button 
                        className="product-button product-button-secondary"
                        onClick={() => {
                        setSearch('');
                        setCategory('');
                        setPublisher('');
                        setMaxPrice('');
                        setOnlyDiscounted(false);
                        }}
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div className="product-games-grid">
                    {filteredGames.map((game) => (
                        <div key={game.id} className="product-game-card">
                            <div className="product-game-image-container">
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    className="product-game-image"
                                />
                                {game.discounted && (
                                    <div className="product-discount-badge">
                                        -{Math.round(((parseFloat(game.originalPrice) - parseFloat(game.price)) / parseFloat(game.originalPrice)) * 100)}%
                                    </div>
                                )}
                            </div>
                            <div className="product-game-content">
                                <div className="product-game-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <h3 className="product-game-title">{game.title}</h3>
                                        <Maximize 
                                            size={16} 
                                            className="search-icon"
                                            onClick={() => handleGameInfo(game)}
                                        />
                                    </div>
                                    <span className="product-game-rating">★ {game.rating}</span>
                                </div>
                                <p className="product-game-description">{game.description}</p>
                                <div className="product-game-details">
                                    <span className="product-game-publisher">{game.publisher}</span>
                                    <span className="product-game-category">{game.category}</span>
                                </div>
                                <div className="product-game-footer">
                                    <div className="product-game-price-container">
                                        <span className="product-game-price">${game.price}</span>
                                        {game.discounted && (
                                            <span className="product-game-original-price">${game.originalPrice}</span>
                                        )}
                                    </div>
                                    <div className="product-button-group">
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
            )}

            {/* Purchase Modal */}
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
                                        {selectedGame.discounted && (
                                            <span className="product-game-original-price"> 
                                                ${selectedGame.originalPrice}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="product-button product-button-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="product-button product-button-buy"
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

export default Products;