
const PurchaseGameModal = ({ 
    show, 
    game, 
    onClose, 
    onConfirm 
  }) => {
    if (!show) return null;
    const price = parseFloat(game.precio_original);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Confirmar Compra</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            <div className="mb-6">
                <div className="flex gap-4">
                <img src={game.gameBanner || 'https://via.placeholder.com/280x160'} 
                    alt={game.game_name} className="w-32 h-32 object-cover rounded" />
                <div>
                    <h3 className="font-bold">{game.game_name}</h3>
                    <p className="text-gray-600">{game.game_description}</p>
                    <p>Publicador: {game.editor_nombre}</p>
                    <p>Categoría: {game.categorias}</p>
                    <p className="modal-game-price">
                                Precio: 
                                {
                                game.descuento_porcentaje > 0 ? (
                                        <>
                                            ${price - (price * (game.descuento_porcentaje / 100))}
                                            <span className="game-original-price"> 
                                                ${price}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            ${price}
                                        </>
                                    )
                                }
                            </p>
                </div>
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <button 
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                    Cancelar
                </button>
                <button 
                    onClick={onConfirm}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                    Confirmar Compra
                </button>
            </div>
            </div>
        </div>
    );
};

export default PurchaseGameModal;