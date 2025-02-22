import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { GamesAPI } from '../../BackEnd/API/GamesAPI';
import GameInfo from './components/GameInfo';
import PurchaseGameModal from './components/PurchaseGameModal';

const Game = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [game, setGame] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const allGamesResponse = await GamesAPI.getAllGames();
                
                let userGamesFav = [];
                let userGames = [];

                const userId = localStorage.getItem('user');
                if (userId) {
                    try {
                        userGamesFav = await GamesAPI.getUserFavorites(userId);
                    } catch (favError) {
                        console.error('Error fetching user favorites:', favError);
                        userGamesFav = [];
                    }
                    try {
                        userGames = await GamesAPI.getUserGames(userId);
                    } catch (userGamesError) {
                        console.error('Error fetching user games:', userGamesError);
                        userGames = [];
                    }
                }
    
                const userFavoriteIds = userGamesFav.data 
                    ? userGamesFav.data.map(fav => fav.id_game) 
                    : [];

                const userGamesIds = userGames.data 
                    ? userGames.data.map(game => game.id_game) 
                    : [];

                const foundGame = allGamesResponse.data.find(g => g.id_game === parseInt(id));
                
                if (foundGame) {
                    setGame(foundGame);
                } else {
                    navigate('/products');
                }

                setFavorites(userFavoriteIds);
                setPurchases(userGamesIds);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching game data:', err);
                setError('No se pudo cargar la información del juego');
                setIsLoading(false);
                navigate('/products');
            }
        };

        // Keep purchases logic from localStorage
        const savedPurchases = localStorage.getItem('gameBuy');
        
        if (savedPurchases) {
            try {
                const parsedPurchases = JSON.parse(savedPurchases);
                setPurchases(Array.isArray(parsedPurchases) ? parsedPurchases : []);
            } catch (e) {
                setPurchases([]);
            }
        }

        fetchGameData();
    }, [id, navigate]);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const toggleFavorite = async (gameId) => {
        if (!isLoggedIn) {
            showToast('Debe de estar Logeado para agregar a Favoritos');
            return;
        }

        try {
            if (favorites.includes(gameId)) {
                await GamesAPI.removeFromFavorites(localStorage.getItem('user'), gameId);
                const newFavorites = favorites.filter(favId => favId !== gameId);
                setFavorites(newFavorites);
                showToast(`${game.game_name} se eliminó de favoritos`);
            } else {
                await GamesAPI.addToFavorites(localStorage.getItem('user'), gameId);
                const newFavorites = [...favorites, gameId];
                setFavorites(newFavorites);
                showToast(`${game.game_name} se agregó a favoritos`);
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
            showToast('No se pudo actualizar favoritos');
        }
    };

    const handleBuy = () => {
        if (!isLoggedIn) {
            showToast('Debe de estar Logeado para comprar');
            return;
        }
        setShowModal(true);
    };

    const handlePurchaseConfirmation = async () => {
        try {
            const userId = localStorage.getItem('user');
            const gameId = game.id_game;

            if (purchases.includes(gameId)) {
                showToast('¡Ya has comprado este juego!');
                setShowModal(false);
                return;
            }

            await GamesAPI.purchaseGame(userId, gameId);

            const newPurchases = [...purchases, gameId];
            setPurchases(newPurchases);
            localStorage.setItem('gameBuy', JSON.stringify(newPurchases));

            showToast('¡Compra confirmada!');
            navigate('/mylibrary');
            setShowModal(false);
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            showToast('Error al procesar la compra. Por favor, intenta nuevamente.');
            setShowModal(false);
        }
    };

    if (isLoading) {
        return <div>Cargando información del juego...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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

            <GameInfo
                game={game}
                isLoggedIn={isLoggedIn}
                purchases={purchases}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                handleBuy={handleBuy}
                showToast={showToast}
            />
            
            <PurchaseGameModal
                show={showModal}
                game={game}
                onClose={() => setShowModal(false)}
                onConfirm={handlePurchaseConfirmation}
            />

            {toast && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Game;