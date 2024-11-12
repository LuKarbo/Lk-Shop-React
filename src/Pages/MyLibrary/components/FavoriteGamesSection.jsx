import { useNavigate } from 'react-router-dom';

const FavoriteGamesSection = ({ favorites, games_list, purchasedGames }) => {
    const navigate = useNavigate();

    const getFavoriteGames = () => {
        const purchasedIds = purchasedGames.map(game => game.id);
        return games_list.filter(game => 
            favorites.includes(game.id) && !purchasedIds.includes(game.id)
        );
    };

    const navigateToStore = (gameTitle) => {
        navigate(`/products?search=${encodeURIComponent(gameTitle)}`);
    };

    return (
        <div>
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
        </div>
    );
};

export default FavoriteGamesSection;