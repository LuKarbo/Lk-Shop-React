import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { GamesAPI } from '../../BackEnd/API/GamesAPI';
import Toast from '../../components/Toast/Toast';
import PurchasedGamesSection from './components/PurchasedGamesSection';
import FavoriteGamesSection from './components/FavoriteGamesSection';
import PurchaseInfoModal  from './components/PurchaseInfoModal';
import DownloadModal  from './components/DownloadModal';
import RefundModal  from './components/RefundModal';
import UninstallConfirmModal  from './components/UninstallConfirmModal';
import UninstallProgressModal  from './components/UninstallProgressModal';

const MyLibrary = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [purchasedGames, setPurchasedGames] = useState([]);
    const [allGames, setAllGames] = useState([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showUninstallConfirmModal, setShowUninstallConfirmModal] = useState(false);
    const [showUninstallProgressModal, setShowUninstallProgressModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const user = localStorage.getItem('user');
                const gamesResponse = await GamesAPI.getAllGames();
                const userGames = await GamesAPI.getUserGames(user);
                const userGamesFav = await GamesAPI.getUserFavorites(user);
                
                setAllGames(gamesResponse.data);
                setFavorites(userGamesFav);

                const purchasedGamesFull = userGames.data.map(userGame => {
                    const gameDetails = gamesResponse.data.find(game => game.id_game === userGame.id_game);
                    return {
                        ...gameDetails,
                        installed: false,
                        purchaseId: 0,
                        purchaseDate: null
                    };
                });

                setPurchasedGames(purchasedGamesFull);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setFavorites([]);
                setPurchasedGames([]);
                showToast('No se pudieron cargar los juegos');
            }
        };

        fetchUserData();
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
        
        setTimeout(() => {
            setShowDownloadModal(false);
            const updatedGames = purchasedGames.map(g => 
                g.id_game === game.id_game ? { ...g, installed: true } : g
            );
            setPurchasedGames(updatedGames);
            
            const installedGames = JSON.parse(localStorage.getItem('gameInstalled') || '{}');
            installedGames[game.id_game] = true;
            localStorage.setItem('gameInstalled', JSON.stringify(installedGames));
            
            showToast(`${game.game_name} se ha instalado correctamente`);
        }, 3000);
    };

    const handleUninstallClick = (game) => {
        setSelectedGame(game);
        setShowUninstallConfirmModal(true);
    };

    const processUninstall = () => {
        setShowUninstallConfirmModal(false);
        setShowUninstallProgressModal(true);

        setTimeout(() => {
            setShowUninstallProgressModal(false);
            
            const updatedGames = purchasedGames.map(g => 
                g.id_game === selectedGame.id_game ? { ...g, installed: false } : g
            );
            setPurchasedGames(updatedGames);
            
            const installedGames = JSON.parse(localStorage.getItem('gameInstalled') || '{}');
            installedGames[selectedGame.id_game] = false;
            localStorage.setItem('gameInstalled', JSON.stringify(installedGames));
            
            showToast(`${selectedGame.game_name} se ha desinstalado correctamente`);
            setSelectedGame(null);
        }, 3000);
    };

    const handlePlay = (game) => {
        showToast(`Iniciando ${game.game_name}...`);
    };

    const handleRefund = (game) => {
        if (game.installed) {
            showToast("Debes desinstalar el juego antes de solicitar un reembolso");
            return;
        }
        setSelectedGame(game);
        setShowRefundModal(true);
    };

    const processRefund = async () => {
        try {
            await GamesAPI.refoundGame(localStorage.getItem('user'), selectedGame.id_game);
            
            const updatedPurchasedGames = purchasedGames.filter(
                game => game.id_game !== selectedGame.id_game
            );
            setPurchasedGames(updatedPurchasedGames);

            setShowRefundModal(false);
            showToast(`${selectedGame.game_name} ha sido reembolsado exitosamente`);
            setSelectedGame(null);
        } catch (error) {
            console.error('Refund error:', error);
            showToast('Error al procesar el reembolso');
        }
    };
    
    return (
        <div className="product-container">
            <div>
                <PurchasedGamesSection 
                    purchasedGames={purchasedGames}
                    onPurchaseInfo={handlePurchaseInfo}
                    onPlay={handlePlay}
                    onDownload={handleDownload}
                    onUninstall={handleUninstallClick}
                    onRefund={handleRefund}
                />
            </div>

            <div>
                <FavoriteGamesSection 
                    favorites={favorites}
                    games_list={allGames}
                    purchasedGames={purchasedGames}
                />
            </div>

            {showPurchaseModal && selectedGame && (
                <PurchaseInfoModal
                    game={selectedGame}
                    onClose={() => setShowPurchaseModal(false)}
                />
            )}

            {showDownloadModal && selectedGame && (
                <DownloadModal
                    game={selectedGame}
                    onClose={() => setShowDownloadModal(false)}
                />
            )}

            {showRefundModal && selectedGame && (
                <RefundModal
                    game={selectedGame}
                    onClose={() => setShowRefundModal(false)}
                    onConfirm={processRefund}
                />
            )}

            {showUninstallConfirmModal && selectedGame && (
                <UninstallConfirmModal
                    game={selectedGame}
                    onClose={() => setShowUninstallConfirmModal(false)}
                    onConfirm={processUninstall}
                />
            )}

            {showUninstallProgressModal && selectedGame && (
                <UninstallProgressModal
                    game={selectedGame}
                />
            )}

            {toast && <Toast message={toast} isVisible={!!toast} />}
        </div>
    );
};

export default MyLibrary;