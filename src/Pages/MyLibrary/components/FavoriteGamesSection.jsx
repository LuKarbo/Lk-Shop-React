import { useNavigate } from 'react-router-dom';

const FavoriteGamesSection = ({ favorites, games_list, purchasedGames }) => {
    const navigate = useNavigate();

    const navigateToStore = (id_game) => {
        navigate(`/game/${id_game}`);
    };

    const filteredFavorites = (favorites?.data || []).filter(favorite => 
        !purchasedGames.some(purchased => purchased.id_game === favorite.id_game)
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Mis Favoritos</h2>
            {filteredFavorites.length === 0 ? (
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
                    {filteredFavorites.map((game) => (
                        <div key={game.id_game} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                            <div className="relative w-full pt-[56.25%]">
                                <img
                                    src={game.gameBanner || 'https://via.placeholder.com/280x160'}
                                    alt={game.game_name}
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col flex-grow p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold truncate">{game.game_name}</h3>
                                    <span className="text-yellow-500 font-medium">$ {game.precio}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{game.descripcion}</p>
                                <div className="mt-auto">
                                    <button
                                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                                        onClick={() => navigateToStore(game.id_game)}
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