import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Info, X } from 'lucide-react';

const MyLibrary = () => {
    const [favorites, setFavorites] = useState([]);
    const [purchasedGames, setPurchasedGames] = useState([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const games_list = [
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

    useEffect(() => {
        // Cargar favoritos del localStorage
        const savedFavorites = localStorage.getItem('gameFavorites');
        if (savedFavorites) {
            try {
                const parsedFavorites = JSON.parse(savedFavorites);
                setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
            } catch (error) {
                console.error('Error parsing favorites:', error);
                setFavorites([]);
            }
        }

        // Cargar juegos comprados del localStorage
        const savedBuy = localStorage.getItem('gameBuy');
        if (savedBuy) {
            try {
                const parsedPurchases = JSON.parse(savedBuy);

                const purchasedGamesFull = games_list.filter(game => 
                    Array.isArray(parsedPurchases) && parsedPurchases.includes(game.id)
                );
                setPurchasedGames(purchasedGamesFull);
            } catch (error) {
                console.error('Error parsing purchased games:', error);
                setPurchasedGames([]);
            }
        }
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handlePurchaseInfo = (game) => {
        const gameWithPurchaseInfo = {
            ...game,
            purchaseId: `PUR-${Math.random().toString(36).substr(2, 9)}`,
            purchaseDate: new Date().toLocaleDateString()
        };
        setSelectedGame(gameWithPurchaseInfo);
        setShowPurchaseModal(true);
    };

    const handleDownload = (game) => {
        setSelectedGame(game);
        setShowDownloadModal(true);
        // Simular proceso de descarga
        setTimeout(() => {
            setShowDownloadModal(false);
            showToast(`${game.title} se ha instalado correctamente`);
        }, 3000);
    };

    const navigateToStore = (gameTitle) => {
        navigate(`/products?search=${encodeURIComponent(gameTitle)}`);
    };

    const getFavoriteGames = () => {
        const purchasedIds = purchasedGames.map(game => game.id);
        
        return games_list.filter(game => 
            favorites.includes(game.id) && !purchasedIds.includes(game.id)
        );
    };

    return (
        <div className="product-container">
            {/* Sección de Juegos Comprados */}
            <h2 className="text-2xl font-bold mb-6">Mis Juegos</h2>
            {purchasedGames.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg mb-12">
                    <p className="text-gray-600 text-lg">No tienes juegos comprados todavía.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 product-button product-button-secondary"
                    >
                        Explorar tienda
                    </button>
                </div>
            ):(
                <div className="product-games-grid mb-12">
                {purchasedGames.map((game) => (
                    <div key={game.id} className="product-game-card">
                        <div className="product-game-image-container">
                            <img
                                src={game.image}
                                alt={game.title}
                                className="product-game-image"
                            />
                        </div>
                        <div className="product-game-content">
                            <div className="product-game-header">
                                <h3 className="product-game-title">{game.title}</h3>
                                <span className="product-game-rating">★ {game.rating}</span>
                            </div>
                            <p className="product-game-description">{game.description}</p>
                            <div className="product-game-details">
                                <span className="product-game-publisher">{game.publisher}</span>
                                <span className="product-game-category">{game.category}</span>
                            </div>
                            <div className="product-game-footer">
                                <div className="product-button-group" style={{ width: '100%' }}>
                                    <button
                                        className="product-button product-button-secondary"
                                        onClick={() => handlePurchaseInfo(game)}
                                    >
                                        <Info size={20} className="mr-2" />
                                        Ver Compra
                                    </button>
                                    <button
                                        className="product-button product-button-buy"
                                        onClick={() => handleDownload(game)}
                                    >
                                        <Download size={20} className="mr-2" />
                                        Descargar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}

            {/* Sección de Favoritos */}
            <h2 className="text-2xl font-bold mb-6">Mis Favoritos</h2>
            {getFavoriteGames().length===0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg">No tienes juegos en tu lista de favoritos.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 product-button product-button-secondary"
                    >
                        Descubrir juegos
                    </button>
                </div>
            ):(
                <div className="product-games-grid">
                    {getFavoriteGames().map((game) => (
                        <div key={game.id} className="product-game-card">
                            <div className="product-game-image-container">
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    className="product-game-image"
                                />
                            </div>
                            <div className="product-game-content">
                                <div className="product-game-header">
                                    <h3 className="product-game-title">{game.title}</h3>
                                    <span className="product-game-rating">★ {game.rating}</span>
                                </div>
                                <p className="product-game-description">{game.description}</p>
                                <div className="product-game-details">
                                    <span className="product-game-publisher">{game.publisher}</span>
                                    <span className="product-game-category">{game.category}</span>
                                </div>
                                <div className="product-game-footer">
                                    <div className="product-button-group" style={{ width: '100%' }}>
                                        <button
                                            className="product-button product-button-buy"
                                            onClick={() => navigateToStore(game.title)}
                                        >
                                            Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Información de Compra */}
            {showPurchaseModal && selectedGame && (
                <div className="modal-overlay" onClick={() => setShowPurchaseModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Detalles de la Compra</h2>
                            <button className="modal-close" onClick={() => setShowPurchaseModal(false)}>
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
                                    <p><strong>ID de Compra:</strong> {selectedGame.purchaseId}</p>
                                    <p><strong>Fecha de Compra:</strong> {selectedGame.purchaseDate}</p>
                                    <p><strong>Precio:</strong> ${selectedGame.price}</p>
                                    <p><strong>Publicador:</strong> {selectedGame.publisher}</p>
                                    <p><strong>Categoría:</strong> {selectedGame.category}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="product-button product-button-secondary"
                                onClick={() => setShowPurchaseModal(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Descarga */}
            {showDownloadModal && selectedGame && (
                <div className="modal-overlay" onClick={() => setShowDownloadModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Descargando {selectedGame.title}</h2>
                            <button className="modal-close" onClick={() => setShowDownloadModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="text-center p-6">
                                <Download size={48} className="mx-auto mb-4" />
                                <p className="text-lg">Tu juego se está instalando...</p>
                                <p className="text-sm text-gray-500 mt-2">Por favor, no cierres esta ventana</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`toast ${toast ? 'toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default MyLibrary;