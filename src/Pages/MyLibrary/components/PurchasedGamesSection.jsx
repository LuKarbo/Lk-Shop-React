import { useNavigate } from 'react-router-dom';
import { Info, Play, Download, Trash2, RefreshCcw } from 'lucide-react';

const PurchasedGamesSection = ({
    purchasedGames,
    onPurchaseInfo,
    onPlay,
    onDownload,
    onUninstall,
    onRefund
}) => {
    const navigate = useNavigate();
    return (
        <>
            <h2 className="text-2xl font-bold mb-6">Mis Juegos</h2>
            {purchasedGames.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg mb-12">
                    <p className="text-gray-600 text-lg">No tienes juegos comprados todavía.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 product-button product-button-secondary"
                    >
                        Explorar tienda
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {purchasedGames.map((game) => (
                        <div key={game.id} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
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
                                    <span className="text-yellow-500 font-medium">★ {parseFloat(game.puntaje)}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{game.game_description}</p>
                                <div className="flex justify-between text-sm text-gray-500 mb-4">
                                    <span>{game.editor_nombre}</span>
                                    <span>{game.categorias}</span>
                                </div>
                                <div className="mt-auto space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm"
                                            onClick={() => onPurchaseInfo(game)}
                                        >
                                            <Info size={16} className="mr-1" />
                                            Ver
                                        </button>
                                        {game.installed ? (
                                            <button
                                                className="flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
                                                onClick={() => onPlay(game)}
                                            >
                                                <Play size={16} className="mr-1" />
                                                Jugar
                                            </button>
                                        ) : (
                                            <button
                                                className="flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                                                onClick={() => onDownload(game)}
                                            >
                                                <Download size={16} className="mr-1" />
                                                Instalar
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {game.installed && (
                                            <button
                                                className="flex items-center justify-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors text-sm"
                                                onClick={() => onUninstall(game)}
                                            >
                                                <Trash2 size={16} className="mr-1" />
                                                Desinstalar
                                            </button>
                                        )}
                                        <button
                                            className={`flex items-center justify-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors text-sm ${game.installed ? 'col-span-1' : 'col-span-2'}`}
                                            onClick={() => onRefund(game)}
                                        >
                                            <RefreshCcw size={16} className="mr-1" />
                                            Reembolsar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PurchasedGamesSection;