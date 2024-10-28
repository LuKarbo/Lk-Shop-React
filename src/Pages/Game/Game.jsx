import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';

const Game = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [game, setGame] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const games = [
        {
            id: 1,
            title: "The Last Journey",
            description: "Un épico juego de aventuras que te llevará a través de mundos inexplorados",
            price: "59.99",
            rating: 4.8,
            image: "https://via.placeholder.com/800x600",
            category: "Aventura",
            publisher: "EA",
            discounted: true,
            originalPrice: "79.99",
            copies: 150,
            discountId: 1
        },
        {
            id: 5,
            title: "Ninja Warriors",
            description: "Combates ninja con mecánicas únicas de sigilo",
            price: "54.99",
            rating: 4.6,
            image: "https://via.placeholder.com/800x600",
            category: "Acción",
            publisher: "Ubisoft",
            discounted: false,
            originalPrice: "54.99"
        }
    ];

    useEffect(() => {
        const savedFavorites = localStorage.getItem('gameFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }

        const foundGame = games.find(g => g.id === parseInt(id));
        if (foundGame) {
            setGame(foundGame);
        } else {
            navigate('/products');
        }
    }, [id, navigate]);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const toggleFavorite = (gameId) => {
        if (!isLoggedIn) {
            showToast('Debe de estar Logeado para agregar a Favoritos');
            return;
        }

        const newFavorites = favorites.includes(gameId)
            ? favorites.filter(id => id !== gameId)
            : [...favorites, gameId];
        
        setFavorites(newFavorites);
        localStorage.setItem('gameFavorites', JSON.stringify(newFavorites));
        
        if (!favorites.includes(gameId)) {
            showToast(`${game.title} se agregó a favoritos`);
        }
    };

    const handleBuy = () => {
        if (!isLoggedIn) {
            showToast('Debe de estar Logeado para comprar');
            return;
        }
        setShowModal(true);
    };

    if (!game) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button 
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={20} />
                Volver a Productos
            </button>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                    <img 
                        src={game.image} 
                        alt={game.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                    {game.discounted && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                            -{Math.round(((parseFloat(game.originalPrice) - parseFloat(game.price)) / parseFloat(game.originalPrice)) * 100)}%
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
                        <div className="flex items-center gap-4 text-gray-600">
                            <span>★ {game.rating}</span>
                            <span>{game.publisher}</span>
                            <span>{game.category}</span>
                        </div>
                    </div>

                    <p className="text-gray-700">{game.description}</p>

                    <div className="flex items-center gap-4">
                        <div>
                            <span className="text-2xl font-bold">${game.price}</span>
                            {game.discounted && (
                                <span className="ml-2 text-gray-500 line-through">${game.originalPrice}</span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleFavorite(game.id)}
                                className={`p-2 rounded-lg border ${
                                    favorites.includes(game.id) 
                                        ? 'bg-primary text-white' 
                                        : 'border-gray-300 hover:bg-gray-50'
                                }`}
                                aria-label={favorites.includes(game.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                            >
                                {favorites.includes(game.id) ? (
                                    <BookmarkCheck size={20} />
                                ) : (
                                    <Bookmark size={20} />
                                )}
                            </button>
                            <button 
                                onClick={handleBuy}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                                Comprar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Confirmar Compra</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-6">
                            <div className="flex gap-4">
                                <img src={game.image} alt={game.title} className="w-32 h-32 object-cover rounded" />
                                <div>
                                    <h3 className="font-bold">{game.title}</h3>
                                    <p className="text-gray-600">{game.description}</p>
                                    <p className="mt-2">
                                        <span className="font-bold">${game.price}</span>
                                        {game.discounted && (
                                            <span className="ml-2 text-gray-500 line-through">${game.originalPrice}</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {
                                    alert('¡Compra confirmada!');
                                    setShowModal(false);
                                }}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                                Confirmar Compra
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Game;