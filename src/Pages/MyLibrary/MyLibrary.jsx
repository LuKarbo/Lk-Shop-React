import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { games_list } from '../../BackEnd/Data/games';
import { Download, Info, X, RefreshCcw } from 'lucide-react';

const MyLibrary = () => {
    const [favorites, setFavorites] = useState([]);
    const [purchasedGames, setPurchasedGames] = useState([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

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

    const handleRefund = (game) => {
        setSelectedGame(game);
        setShowRefundModal(true);
    };

    const processRefund = () => {
        const updatedPurchasedGames = purchasedGames.filter(
            game => game.id !== selectedGame.id
        );
        setPurchasedGames(updatedPurchasedGames);

        localStorage.setItem('gameBuy', JSON.stringify(updatedPurchasedGames.map(game => game.id)));

        setShowRefundModal(false);
        showToast(`${selectedGame.title} ha sido reembolsado exitosamente`);
        setSelectedGame(null);
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
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {purchasedGames.map((game) => (
                        <div key={game.id} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                            <div className="relative w-full pt-[56.25%]">
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col flex-grow p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold truncate">{game.title}</h3>
                                    <span className="text-yellow-500 font-medium">★ {game.rating}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{game.description}</p>
                                <div className="flex justify-between text-sm text-gray-500 mb-4">
                                    <span>{game.publisher}</span>
                                    <span>{game.category}</span>
                                </div>
                                <div className="mt-auto space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm"
                                            onClick={() => handlePurchaseInfo(game)}
                                        >
                                            <Info size={16} className="mr-1" />
                                            Ver
                                        </button>
                                        <button
                                            className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                                            onClick={() => handleDownload(game)}
                                        >
                                            <Download size={16} className="mr-1" />
                                            Descargar
                                        </button>
                                    </div>
                                    <button
                                        className="flex items-center justify-center w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors text-sm"
                                        onClick={() => handleRefund(game)}
                                    >
                                        <RefreshCcw size={16} className="mr-1" />
                                        Reembolsar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sección de Juegos Favoritos */}
            <h2 className="text-2xl font-bold mb-6">Mis Favoritos</h2>
            {getFavoriteGames().length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg">No tienes juegos en tu lista de favoritos.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 product-button product-button-secondary"
                    >
                        Descubrir juegos
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFavoriteGames().map((game) => (
                        <div key={game.id} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                            <div className="relative w-full pt-[56.25%]">
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col flex-grow p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold truncate">{game.title}</h3>
                                    <span className="text-yellow-500 font-medium">★ {game.rating}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{game.description}</p>
                                <div className="flex justify-between text-sm text-gray-500 mb-4">
                                    <span>{game.publisher}</span>
                                    <span>{game.category}</span>
                                </div>
                                <div className="mt-auto">
                                    <button
                                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                                        onClick={() => navigateToStore(game.title)}
                                    >
                                        Comprar
                                    </button>
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

             {/* Modal de Reembolso */}
            {showRefundModal && selectedGame && (
                <div className="modal-overlay" onClick={() => setShowRefundModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Confirmar Reembolso</h2>
                            <button className="modal-close" onClick={() => setShowRefundModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            ¿Estás seguro que deseas reembolsar {selectedGame.title}? Esta acción no se puede deshacer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-game-info">
                                <img 
                                    src={selectedGame.image} 
                                    alt={selectedGame.title} 
                                    className="modal-game-image"
                                />
                                <div className="modal-game-details">
                                    <h3>{selectedGame.title}</h3>
                                    <p><strong>Precio a reembolsar:</strong> ${selectedGame.price}</p>
                                    <p><strong>Fecha de Compra:</strong> {selectedGame.purchaseDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="product-button product-button-secondary"
                                onClick={() => setShowRefundModal(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="product-button product-button-danger"
                                onClick={processRefund}
                            >
                                Confirmar Reembolso
                            </button>
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