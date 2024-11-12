import { X } from 'lucide-react';

const PurchaseInfoModal = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Detalles de la Compra</h2>
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
              <p><strong>ID de Compra:</strong> {game.purchaseId}</p>
              <p><strong>Fecha de Compra:</strong> {game.purchaseDate}</p>
              <p><strong>Precio:</strong> ${game.price}</p>
              <p><strong>Publicador:</strong> {game.publisher}</p>
              <p><strong>Categoría:</strong> {game.category}</p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="product-button product-button-secondary"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseInfoModal;