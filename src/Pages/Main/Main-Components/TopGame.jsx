import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../../../BackEnd/Auth/AuthContext';
import { games_list } from '../../../BackEnd/Data/games';
import CardGame from './CardGame';
import PurchaseModal from './PurchaseModal'; 
import './CardsStyle.css';

const TopGame = () => {
    const { isLoggedIn } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const topGames = games_list
    .sort((a, b) => b.copies - a.copies)
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
        const game = topGames.find(g => g.id === gameId);
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

    const handleGameInfo = (game) => {
        navigate(`/game/${game.id}`);
    };

    return (
        <div className="topgame-container">
            <h2>Juegos Más Comprados</h2>
            <div className="topgame-games-grid">
                {topGames.map((game) => (
                    <CardGame
                        key={game.id}
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