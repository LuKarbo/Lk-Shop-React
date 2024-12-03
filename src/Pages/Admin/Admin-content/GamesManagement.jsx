import { useState, useEffect } from 'react';
import { GamesAPI } from '../../../BackEnd/API/GamesAPI';
import { DiscountApi } from '../../../BackEnd/API/DiscountAPI';
import GamesTable from './Games-content/GamesTable';
import DiscountManagement from './Games-content/DiscountManagement';
import AddGameModal from './Games-content/AddGameModal';


const GamesManagement = () => {
    const [games, setGames] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [editors, setEditors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [gameSearch, setGameSearch] = useState('');
    const [gamePage, setGamePage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);

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
                console.log(gamesEditors.data);
                console.log(gamesCategories.data);
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
        console.log(discounts);
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

    const refreshDiscounts = async () => {
        try {
            const discountsResponse = await DiscountApi.getAll();
            setDiscounts(discountsResponse.data);
        } catch (error) {
            console.error('Error refreshing discounts:', error);
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
    console.log('Edit game:', game);
};

const handleOpenDeleteModal = (game) => {
    console.log('Delete game:', game);
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
                console.log("Juego añadido correctamente:", result.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }

        console.log('New game data:', gameData);
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
                refreshDiscounts={refreshDiscounts}
            />

            <AddGameModal 
                isOpen={isAddGameModalOpen}
                onClose={() => setIsAddGameModalOpen(false)}
                onSubmit={handleAddGame}
                discounts={discounts}
                editors={editors}
                categories={categories}
            />
        </>
    );
};

export default GamesManagement;