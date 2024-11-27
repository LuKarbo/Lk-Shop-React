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
    const price = parseFloat(game.precio_original);
    
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="relative">
                <img 
                    src={game.gameBanner || 'https://via.placeholder.com/280x160'}
                    alt={game.game_name}
                    className="w-full rounded-lg shadow-lg"
                />
                {game.descuento_porcentaje > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                        -{game.descuento_porcentaje}%
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{game.game_name}</h1>
                    <div className="flex items-center gap-4 text-gray-600">
                        <span>★ {game.puntaje}</span>
                        <span>{game.editor_nombre}</span>
                        <span>{game.categorias}</span>
                    </div>
                </div>

                <p className="text-gray-700">{game.game_description}</p>

                <div className="flex items-center gap-4">
                    <div>
                        {game.descuento_porcentaje > 0 ? (
                            <>
                                ${(price - (price * (game.descuento_porcentaje / 100))).toFixed(2)}
                                <span className="line-through text-gray-500 ml-2"> 
                                    ${price.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <>${price.toFixed(2)}</>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {isLoggedIn ? (
                            purchases.includes(game.id_game) ? (
                                <Link 
                                    to="/mylibrary"
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    En la Biblioteca
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => toggleFavorite(game.id_game)}
                                        className={`p-2 rounded-lg border ${
                                            favorites.includes(game.id_game) 
                                            ? 'bg-primary text-white' 
                                            : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                        aria-label={favorites.includes(game.id_game) ? "Quitar de favoritos" : "Añadir a favoritos"}
                                    >
                                        {favorites.includes(game.id_game) ? (
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