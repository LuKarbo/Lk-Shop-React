import { useState, useEffect } from 'react';
import { GamesAPI } from '../../../BackEnd/API/GamesAPI';
import { DiscountApi } from '../../../BackEnd/API/DiscountAPI';
import GamesTable from './Games-content/GamesTable';
import DiscountManagement from './Games-content/DiscountManagement';
import AddGameModal from './Games-content/AddGameModal';
import DeleteGameModal from './Games-content/DeleteGameModal';
import EditGameModal from './Games-content/EditGameModal';
import ReviewsTable from './Games-content/ReviewsTable';


const GamesManagement = () => {
    const [games, setGames] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [editors, setEditors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [gameSearch, setGameSearch] = useState('');
    const [gamePage, setGamePage] = useState(1);
    
    const ITEMS_PER_PAGE = 8;

    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [gameToDelete, setGameToDelete] = useState(null);
    const [isEditGameModalOpen, setIsEditGameModalOpen] = useState(false);
    const [gameToEdit, setGameToEdit] = useState(null);

    const accessToken = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gamesResponse = await GamesAPI.getAllGames();
                const gamesEditors = await GamesAPI.getEditors();
                const gamesCategories = await GamesAPI.getCategories();
                const discountsResponse = await DiscountApi.getAll();
        
                setGames(gamesResponse.data);
                setDiscounts(discountsResponse.data);
                setEditors(gamesEditors.data);
                setCategories(gamesCategories.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    const getDiscountInfo = (discountId) => {
        if (!discounts || !discountId) return 'Sin descuento';
        
        const discount = discounts.find(d => d.id_discount_code === discountId);
        if (!discount) return 'Sin descuento';
        
        if (discount.status_nombre === 'Caducado') return 'Caducado';
        return discount.status_nombre === 'Activo' ? `${discount.procentaje}%` : 'Sin descuento';
    };
    
    const getDiscountBadgeStyle = (discountId) => {

        if (!discounts || !discountId) return 'bg-gray-100 text-gray-800';
        
        const discount = discounts.find(d => d.id_discount_code === discountId);
        if (!discount) return 'bg-gray-100 text-gray-800';
    
        switch (discount.status_nombre) {
            case 'Caducado':
                return 'bg-red-100 text-red-800';
            case 'Activo':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const refreshData = async () => {
        try {
            const discountsResponse = await DiscountApi.getAll();
            const gamesResponse = await GamesAPI.getAllGames();
            setDiscounts(discountsResponse.data);
            setGames(gamesResponse.data);
        } catch (error) {
            console.error('Error refreshing:', error);
        }
    };

const filteredGames = games.filter(game => 
    game.game_name.toLowerCase().includes(gameSearch.toLowerCase())
);

const paginatedGames = filteredGames.slice(
    (gamePage - 1) * ITEMS_PER_PAGE, 
    gamePage * ITEMS_PER_PAGE
);

const handleOpenEditModal = (game) => {
    setGameToEdit(game);
    setIsEditGameModalOpen(true);
};

const handleUpdateGame = async (updatedGameData) => {
    try {
        const result = await GamesAPI.editGame(updatedGameData.id_game,
            updatedGameData.game_name,
            updatedGameData.game_description,
            updatedGameData.gameBanner,
            updatedGameData.fecha_lanzamiento,
            updatedGameData.precio_original,
            updatedGameData.id_descuento,
            updatedGameData.puntaje,
            updatedGameData.editor_id,
            updatedGameData.copias_disponibles,
            updatedGameData.copias_cantidad,
            updatedGameData.categorias
        )
        if (result.success) {
            setIsEditGameModalOpen(false);
            setGameToEdit(false);
            refreshData();
        }
    } catch (error) {
        console.error('Error updating game:', error);
    }
};

const handleOpenDeleteModal = (game) => {
    setGameToDelete(game);
    setIsDeleteModalOpen(true);
};

const handleConfirmDelete = async (gameId) => {
    try {
        const deleteGame = await GamesAPI.deleteGame(gameId);
        if(deleteGame.success){
            setIsDeleteModalOpen(false);
            setGameToDelete(null);
            refreshData();
        }
    } catch (error) {
        console.error("Error deleting game:", error);
    }
};

    const handleAddGame = async (gameData) => {
        try{
            const result = await GamesAPI.createGame(gameData.game_name,
                gameData.game_description,
                gameData.gameBanner,
                gameData.fecha_lanzamiento,
                gameData.precio_original,
                gameData.id_descuento,
                gameData.puntaje,
                gameData.editor_id,
                gameData.copias_disponibles,
                gameData.copias_cantidad,
                gameData.categorias
            )
            if (result.success) {
                const gamesResponse = await GamesAPI.getAllGames();
                setGames(gamesResponse.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        setIsAddGameModalOpen(false);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">Juegos</h3>
                <button
                    onClick={() => setIsAddGameModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Juego Nuevo
                </button>
                </div>
                <input
                type="text"
                placeholder="Buscar juegos..."
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
                className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <GamesTable 
                paginatedGames={paginatedGames}
                getDiscountInfo={getDiscountInfo}
                getDiscountBadgeStyle={getDiscountBadgeStyle}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal}
                gamePage={gamePage}
                setGamePage={setGamePage}
                filteredGames={filteredGames}
                ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            />

            <DiscountManagement 
                discounts={discounts}
                setDiscounts={setDiscounts}
                refreshData={refreshData}
            />

            <ReviewsTable />

            <AddGameModal 
                isOpen={isAddGameModalOpen}
                onClose={() => setIsAddGameModalOpen(false)}
                onSubmit={handleAddGame}
                discounts={discounts}
                editors={editors}
                categories={categories}
            />

            <DeleteGameModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirmDelete={handleConfirmDelete}
                game={gameToDelete}
            />

            <EditGameModal 
                isOpen={isEditGameModalOpen}
                onClose={() => setIsEditGameModalOpen(false)}
                onSubmit={handleUpdateGame}
                game={gameToEdit}
                discounts={discounts}
                editors={editors}
                categories={categories}
            />
        </>
    );
};

export default GamesManagement;