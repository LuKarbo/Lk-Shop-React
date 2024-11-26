import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../../../BackEnd/Auth/AuthContext';
import { GamesAPI } from '../../../BackEnd/API/GamesAPI';
import CardGame from './CardGame';
import PurchaseModal from './PurchaseModal'; 
import './CardsStyle.css';

const TopGame = () => {
    const { isLoggedIn } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [topGames, setTopGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopGames = async () => {
            try {
                const allGames = await GamesAPI.getAllGames();
                
                const userGamesFav = await GamesAPI.getUserFavorites(localStorage.getItem('user'));
                const userFavoriteIds = userGamesFav.data.map(fav => fav.id_game);
    
                const sortedTopGames = allGames.data
                    .sort((a, b) => b.copias_cantidad - a.copias_disponibles)
                    .slice(0, 5);
    
                console.log(sortedTopGames);
                setTopGames(sortedTopGames);
                setFavorites(userFavoriteIds);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching top games:', err);
                setError('No se pudieron cargar los juegos');
                setIsLoading(false);
            }
        };
    
        const savedPurchases = localStorage.getItem('gameBuy');
        
        if (savedPurchases) {
            try {
                const parsedPurchases = JSON.parse(savedPurchases);
                setPurchases(Array.isArray(parsedPurchases) ? parsedPurchases : []);
            } catch (e) {
                setPurchases([]);
            }
        }
    
        fetchTopGames();
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const toggleFavorite = async (gameId) => {
        const game = topGames.find(g => g.id_game === gameId);
        try {
            if (favorites.includes(gameId)) {
                await GamesAPI.removeFromFavorites(localStorage.getItem('user'), gameId);
                const newFavorites = favorites.filter(id => id !== gameId);
                setFavorites(newFavorites);
                localStorage.setItem('gameFavorites', JSON.stringify(newFavorites));
                showToast(`${game.game_name} se elimino de favoritos`);
            } else {
                await GamesAPI.addToFavorites(localStorage.getItem('user'), gameId);
                const newFavorites = [...favorites, gameId];
                setFavorites(newFavorites);
                localStorage.setItem('gameFavorites', JSON.stringify(newFavorites));
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
    
            if (!existingPurchases.includes(selectedGame.id_game)) {
                existingPurchases.push(selectedGame.id_game);
                
                localStorage.setItem('gameBuy', JSON.stringify(existingPurchases));
                
                showToast('¡Compra confirmada!');
                navigate(`/mylibrary`);
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

    if (isLoading) {
        return <div>Cargando juegos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="topgame-container">
            <h2>Juegos Más Comprados</h2>
            <div className="topgame-games-grid">
                {topGames.map((game) => (
                    <CardGame
                        key={`topgame-${game.id_game}`}
                        game={game}
                        variant="topgame"
                        isLoggedIn={isLoggedIn}
                        favorites={favorites}
                        purchases={purchases}
                        onFavoriteToggle={toggleFavorite}
                        onBuy={handleBuy}
                        showToast={showToast}
                    />
                ))}
            </div>

            {/* Purchase/Info Modal */}
            <PurchaseModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                game={selectedGame}
                onConfirm={handlePurchaseConfirmation}
            />

            {toast && (
                <div className={`contact-toast ${toast ? 'contact-toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default TopGame;