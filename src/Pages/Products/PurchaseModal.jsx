import { X } from 'lucide-react';

const PurchaseModal = ({ 
    show, 
    onClose, 
    game, 
    onConfirmPurchase 
}) => {
    if (!show || !game) return null;

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
                            src={game.image} 
                            alt={game.title} 
                            className="modal-game-image"
                        />
                        <div className="modal-game-details">
                            <h3>{game.title}</h3>
                            <p>{game.description}</p>
                            <p>Publicador: {game.publisher}</p>
                            <p>Categoría: {game.category}</p>
                            <p className="modal-game-price">
                                Precio: ${game.price}
                                {game.discounted && (
                                    <span className="product-game-original-price"> 
                                        ${game.originalPrice}
                                    </span>
                                )}
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