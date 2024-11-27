import { useState, useEffect } from 'react';
import { Search, Bookmark, BookmarkCheck, Maximize } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { GamesAPI } from '../../BackEnd/API/GamesAPI';
import PurchaseModal from './PurchaseModal';
import './Products.css';

const Products = () => {
    const { isLoggedIn } = useAuth();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [publisher, setPublisher] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [onlyDiscounted, setOnlyDiscounted] = useState(false);
    const [allGames, setAllGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editors, setEditors] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    gamesResponse, 
                    editorsResponse, 
                    categoriesResponse, 
                    userId
                ] = await Promise.all([
                    GamesAPI.getAllGames(),
                    GamesAPI.getEditors(),
                    GamesAPI.getCategories(),
                    localStorage.getItem('user')
                ]);

                const games = gamesResponse.data || [];
                setAllGames(games);
                setFilteredGames(games);

                setEditors(editorsResponse.data || []);
                setCategories(categoriesResponse.data || []);
                
                if (userId) {
                    const [favoritesResponse, purchasesResponse] = await Promise.all([
                        GamesAPI.getUserFavorites(userId),
                        GamesAPI.getUserGames(userId)
                    ]);

                    setFavorites(favoritesResponse.data?.map(fav => fav.id_game) || []);
                    setPurchases(purchasesResponse.data?.map(game => game.id_game) || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                showToast('Error al cargar los datos');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const toggleFavorite = async (gameId) => {
        const userId = localStorage.getItem('user');
        const game = allGames.find(g => g.id_game === gameId);
    
        if (!userId) {
            showToast('Debes iniciar sesión para agregar a favoritos');
            return;
        }
    
        try {
            if (favorites.includes(gameId)) {
                await GamesAPI.removeFromFavorites(userId, gameId);
                setFavorites(prev => prev.filter(id => id !== gameId));
                showToast(`${game.game_name} se eliminó de favoritos`);
            } else {
                await GamesAPI.addToFavorites(userId, gameId);
                setFavorites(prev => [...prev, gameId]);
                showToast(`${game.game_name} se agregó a favoritos`);
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
            showToast('No se pudo actualizar favoritos');
        }
    };

    const handleBuy = (game) => {
        setSelectedGame(game);
        setShowModal(true);
    };

    const handlePurchaseConfirmation = async () => {
        try {
            const userId = localStorage.getItem('user');
            const gameId = selectedGame.id_game;

            if (purchases.includes(gameId)) {
                showToast('¡Ya has comprado este juego!');
                setShowModal(false);
                return;
            }

            await GamesAPI.purchaseGame(userId, gameId);
            setPurchases(prev => [...prev, gameId]);
            showToast('¡Compra confirmada!');
            navigate('/mylibrary');
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            showToast('Error al procesar la compra. Por favor, intenta nuevamente.');
        } finally {
            setShowModal(false);
        }
    };

    const handleGameInfo = (game) => {
        navigate(`/game/${game.id_game}`);
    };

    useEffect(() => {
        const filtered = allGames.filter(game => {
            const price = parseFloat(game.precio_original);
            const searchMatch = search === '' || 
                game.game_name?.toLowerCase().includes(search.toLowerCase()) ||
                game.game_description?.toLowerCase().includes(search.toLowerCase());
            
                const categoryMatch = category === '' || 
                (game.categorias &&  game.categorias.split(',')
                    .map(cat => cat.trim().toLowerCase())
                    .includes(category.toLowerCase()));

            const publisherMatch = publisher === '' || game.editor_nombre === publisher;
            const priceMatch = maxPrice === '' || price <= parseFloat(maxPrice);
            const discountMatch = !onlyDiscounted || game.descuento_porcentaje > 0;

            return searchMatch && categoryMatch && publisherMatch && priceMatch && discountMatch;
        });

        setFilteredGames(filtered);
    }, [search, category, publisher, maxPrice, onlyDiscounted, allGames]);

    if (isLoading) {
        return <div>Cargando juegos...</div>;
    }
    
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
                    {categories.map((cat) => (
                        <option 
                            key={cat.id_category} 
                            value={cat.nombre}
                        >
                            {cat.nombre}
                        </option>
                    ))}
                </select>

                <select
                    className="product-filter-select"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                >
                    <option value="">Todos los editores</option>
                    {editors.map((editor) => (
                        <option 
                            key={editor.id_editor} 
                            value={editor.nombre.trim()}
                        >
                            {editor.nombre.trim()}
                        </option>
                    ))}
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
                                    src={game.gameBanner || 'https://via.placeholder.com/280x160'}
                                    alt={game.game_name}
                                    className="product-game-image"
                                />
                                {game.descuento_porcentaje > 0 && (
                                    <div className="product-discount-badge">
                                        -{Math.round(game.descuento_porcentaje)}%
                                    </div>
                                )}
                            </div>
                            <div className="product-game-content">
                                <div className="product-game-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <h3 className="product-game-title">{game.game_name}</h3>
                                        <Maximize 
                                            size={16} 
                                            className="search-icon"
                                            onClick={() => handleGameInfo(game)}
                                        />
                                    </div>
                                    <span className="product-game-rating">★ {parseFloat(game.puntaje)}</span>
                                </div>
                                <p className="product-game-description">{game.game_description}</p>
                                <div className="product-game-details">
                                    <span className="product-game-publisher">{game.editor_nombre}</span>
                                    <span className="product-game-category">{game.categorias}</span>
                                </div>
                                <div className="product-game-footer">
                                    <div className="product-game-price-container">
                                        {game.descuento_porcentaje > 0 ? (
                                            <>
                                                <span className={`product-game-price`}>${parseFloat(game.precio_original) - (parseFloat(game.precio_original) * (game.descuento_porcentaje / 100))}</span>
                                                <span className={`product-game-original-price`}>${parseFloat(game.precio_original)}</span>
                                            </>
                                        ) : (
                                                <span className={`product-game-price`}>${parseFloat(game.precio_original)}</span>
                                        )}
                                    </div>
                                    <div className="product-button-group">
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
                                                        onClick={() => toggleFavorite(game.id_game)}
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
            )}

            {/* Purchase Modal */}
            <PurchaseModal 
                show={showModal}
                onClose={() => setShowModal(false)}
                game={selectedGame}
                onConfirmPurchase={handlePurchaseConfirmation}
            />

            {toast && (
                <div className={`contact-toast ${toast ? 'contact-toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Products;