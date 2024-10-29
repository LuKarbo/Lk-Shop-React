import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';

const Game = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [game, setGame] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const games = [
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

        const savedPurchases = localStorage.getItem('gameBuy');
        if (savedPurchases) {
            try {
                const parsedPurchases = JSON.parse(savedPurchases);
                setPurchases(Array.isArray(parsedPurchases) ? parsedPurchases : []);
            } catch (e) {
                setPurchases([]);
            }
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
    
            if (!existingPurchases.includes(game.id)) {
                existingPurchases.push(game.id);
                
                localStorage.setItem('gameBuy', JSON.stringify(existingPurchases));
                setPurchases(existingPurchases);
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
                            {isLoggedIn ? (
                                purchases.includes(game.id) ? (
                                    <Link 
                                        to="/mylibrary"
                                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    >
                                        En la Biblioteca
                                    </Link>
                                ) : (
                                    <>
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
                                    </>
                                )
                            ) : (
                                <>
                                    <button
                                        onClick={() => showToast('Debe de estar Logeado para agregar a Favoritos')}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                                    >
                                        <Bookmark size={20} />
                                    </button>
                                    <button 
                                        onClick={() => showToast('Debe de estar Logeado para comprar')}
                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                                    >
                                        Comprar
                                    </button>
                                </>
                            )}
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
                                onClick={handlePurchaseConfirmation}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                            >
                                Confirmar Compra
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Game;