import { Trash2 } from 'lucide-react';

const UninstallProgressModal = ({ game }) => {
  if (!game) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Desinstalando {game.game_name}</h2>
        </div>
        <div className="modal-body">
          <div className="text-center p-6">
            <Trash2 size={48} className="mx-auto mb-4 text-red-600 animate-bounce" />
            <p className="text-lg">Desinstalando el juego...</p>
            <p className="text-sm text-gray-500 mt-2">Por favor, no cierres esta ventana</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UninstallProgressModal;