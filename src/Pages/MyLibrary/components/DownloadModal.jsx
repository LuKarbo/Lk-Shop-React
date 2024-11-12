import { Download, X } from 'lucide-react';

const DownloadModal = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Descargando {game.title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <div className="text-center p-6">
            <Download size={48} className="mx-auto mb-4" />
            <p className="text-lg">Tu juego se está instalando...</p>
            <p className="text-sm text-gray-500 mt-2">Por favor, no cierres esta ventana</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;