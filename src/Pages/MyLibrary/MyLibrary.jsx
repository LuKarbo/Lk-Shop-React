import { useState, useEffect } from 'react';
import { games_list } from '../../BackEnd/Data/games';
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
    const [favorites, setFavorites] = useState([]);
    const [purchasedGames, setPurchasedGames] = useState([]);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showUninstallConfirmModal, setShowUninstallConfirmModal] = useState(false);
    const [showUninstallProgressModal, setShowUninstallProgressModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userGamesFav = await GamesAPI.getUserFavorites(localStorage.getItem('user'));
                setFavorites(userGamesFav);
                console.log(favorites);

                const savedBuy = localStorage.getItem('gameBuy');
                const savedInstalled = localStorage.getItem('gameInstalled') || '{}';
                
                if (savedBuy) {
                    const parsedPurchases = JSON.parse(savedBuy);
                    const installedGames = JSON.parse(savedInstalled);

                    const purchasedGamesFull = games_list
                        .filter(game => Array.isArray(parsedPurchases) && parsedPurchases.includes(game.id))
                        .map(game => ({
                            ...game,
                            installed: installedGames[game.id] || false
                        }));
                    setPurchasedGames(purchasedGamesFull);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setFavorites([]);
                setPurchasedGames([]);
                showToast('No se pudieron cargar los juegos favoritos');
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
                g.id === game.id ? { ...g, installed: true } : g
            );
            setPurchasedGames(updatedGames);
            
            const installedGames = JSON.parse(localStorage.getItem('gameInstalled') || '{}');
            installedGames[game.id] = true;
            localStorage.setItem('gameInstalled', JSON.stringify(installedGames));
            
            showToast(`${game.title} se ha instalado correctamente`);
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
                g.id === selectedGame.id ? { ...g, installed: false } : g
            );
            setPurchasedGames(updatedGames);
            
            const installedGames = JSON.parse(localStorage.getItem('gameInstalled') || '{}');
            installedGames[selectedGame.id] = false;
            localStorage.setItem('gameInstalled', JSON.stringify(installedGames));
            
            showToast(`${selectedGame.title} se ha desinstalado correctamente`);
            setSelectedGame(null);
        }, 3000);
    };

    const handlePlay = (game) => {
        showToast(`Iniciando ${game.title}...`);
    };

    const handleRefund = (game) => {
        if (game.installed) {
            showToast("Debes desinstalar el juego antes de solicitar un reembolso");
            return;
        }
        setSelectedGame(game);
        setShowRefundModal(true);
    };

    const processRefund = () => {
        const updatedPurchasedGames = purchasedGames.filter(
            game => game.id !== selectedGame.id
        );
        setPurchasedGames(updatedPurchasedGames);

        const installedGames = JSON.parse(localStorage.getItem('gameInstalled') || '{}');
        delete installedGames[selectedGame.id];
        localStorage.setItem('gameInstalled', JSON.stringify(installedGames));
        
        localStorage.setItem('gameBuy', JSON.stringify(updatedPurchasedGames.map(game => game.id)));

        setShowRefundModal(false);
        showToast(`${selectedGame.title} ha sido reembolsado exitosamente`);
        setSelectedGame(null);
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
                    games_list={games_list}
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