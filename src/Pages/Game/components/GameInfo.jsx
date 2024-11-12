import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const GameInfo = ({ 
    game, 
    isLoggedIn, 
    purchases, 
    favorites, 
    toggleFavorite, 
    handleBuy, 
    showToast 
}) => {
return (
    <div className="grid md:grid-cols-2 gap-8">
        <div className="relative">
        <img 
            src={game.image} 
            alt={game.title}
            className="w-full rounded-lg shadow-lg"
        />
        {game.discounted && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
            -{Math.round(((parseFloat(game.originalPrice) - parseFloat(game.price)) / parseFloat(game.originalPrice)) * 100)}%
            </div>
        )}
        </div>

        <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
            <span>★ {game.rating}</span>
            <span>{game.publisher}</span>
            <span>{game.category}</span>
            </div>
        </div>

        <p className="text-gray-700">{game.description}</p>

        <div className="flex items-center gap-4">
            <div>
            <span className="text-2xl font-bold">${game.price}</span>
            {game.discounted && (
                <span className="ml-2 text-gray-500 line-through">${game.originalPrice}</span>
            )}
            </div>

            <div className="flex gap-2">
            {isLoggedIn ? (
                purchases.includes(game.id) ? (
                <Link 
                    to="/mylibrary"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    En la Biblioteca
                </Link>
                ) : (
                <>
                    <button
                    onClick={() => toggleFavorite(game.id)}
                    className={`p-2 rounded-lg border ${
                        favorites.includes(game.id) 
                        ? 'bg-primary text-white' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-label={favorites.includes(game.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                    {favorites.includes(game.id) ? (
                        <BookmarkCheck size={20} />
                    ) : (
                        <Bookmark size={20} />
                    )}
                    </button>
                    <button 
                    onClick={handleBuy}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                    Comprar
                    </button>
                </>
                )
            ) : (
                <>
                <button
                    onClick={() => showToast('Debe de estar Logeado para agregar a Favoritos')}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                    <Bookmark size={20} />
                </button>
                <button 
                    onClick={() => showToast('Debe de estar Logeado para comprar')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                    Comprar
                </button>
                </>
            )}
            </div>
        </div>
        </div>
    </div>
);
};

export default GameInfo;