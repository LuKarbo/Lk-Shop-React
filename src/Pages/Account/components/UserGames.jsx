const UserGames = ({ games, onViewAll }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Últimos 3 Juegos</h2>
                <button className="text-blue-500 hover:text-blue-600" onClick={onViewAll}>
                    Ver todos
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {games.slice(0, 3).map(game => (
                    <GameItem key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
};

const GameItem = ({ game }) => (
    <div className="flex flex-col">
        <div className="aspect-[7/4] w-full mb-2">
            <img 
            src={game.image} 
            alt={game.title} 
            className="w-full h-full object-cover rounded-lg bg-gray-200"
            />
        </div>
        <h3 className="text-blue-500 font-semibold mb-2">
            {game.title}
        </h3>
        <button 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition w-fit"
            // onClick={() => }
        >
            Jugar
        </button>
    </div>
);

export default UserGames;