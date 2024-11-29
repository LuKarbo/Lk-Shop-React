import { X } from 'lucide-react';

const PurchaseModal = ({ 
    show, 
    onClose, 
    game, 
    onConfirmPurchase 
}) => {
    if (!show || !game) return null;
    const price = parseFloat(game.precio_original);
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Confirmar Compra</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="modal-game-info">
                        <img 
                            src={game.gameBanner || 'https://via.placeholder.com/280x160'}
                            alt={game.game_name} 
                            className="modal-game-image"
                        />
                        <div className="modal-game-details">
                            <h3>{game.game_name}</h3>
                            <p>{game.game_description}</p>
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
                <div className="modal-footer">
                    <button 
                        className="product-button product-button-secondary"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="product-button product-button-buy"
                        onClick={onConfirmPurchase}
                    >
                        Confirmar Compra
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseModal;