import { X } from 'lucide-react';

const UninstallConfirmModal = ({ game, onClose, onConfirm }) => {
  if (!game) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Confirmar Desinstalación</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  ¿Estás seguro que deseas desinstalar {game.game_name}? Podrás volver a instalarlo cuando quieras.
                </p>
              </div>
            </div>
          </div>
          <div className="modal-game-info">
            <img 
              src={game.gameBanner || 'https://via.placeholder.com/280x160'}
              alt={game.game_name} 
              className="modal-game-image"
            />
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
            className="product-button product-button-danger"
            onClick={onConfirm}
          >
            Confirmar Desinstalación
          </button>
        </div>
      </div>
    </div>
  );
};

export default UninstallConfirmModal;