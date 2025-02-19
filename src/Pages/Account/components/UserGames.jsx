import { useNavigate } from 'react-router-dom';

const UserGames = ({ games, onViewAll }) => {
    const hasGames = games && games.length > 0;
    
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Últimos 3 Juegos</h2>
                {hasGames && (
                    <button className="text-blue-500 hover:text-blue-600" onClick={onViewAll}>
                        Ver todos
                    </button>
                )}
            </div>
            
            {!hasGames ? (
                <div className="text-center py-8 text-gray-500">
                    Aún no tienes juegos en tu biblioteca
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {games.slice(0, 3).map(game => (
                        <GameItem 
                            key={game.id_game}
                            game={{
                                id: game.id_game,
                                game_name: game.game_name,
                                gameBanner: game.gameBanner || 'https://via.placeholder.com/280x160'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const GameItem = ({ game }) => {
    const navigate = useNavigate();
    
    const handleGameNavigation = () => {
        navigate(`/game/${game.id}`);
    };
    
    return (
        <div 
            className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={handleGameNavigation}
        >
            <div className="aspect-[7/4] w-full mb-2">
                <img 
                    src={game.gameBanner || 'https://via.placeholder.com/280x160'}
                    alt={game.game_name}
                    className="w-full h-full object-cover rounded-lg bg-gray-200"
                />
            </div>
            <h3 
                className="text-blue-500 font-semibold mb-2 hover:underline"
                onClick={handleGameNavigation}
            >
                {game.game_name}
            </h3>
        </div>
    );
};

export default UserGames;