import { X } from 'lucide-react';

const DeleteGameModal = ({ 
    isOpen, 
    onClose, 
    onConfirmDelete, 
    game 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold mb-4 text-red-600">Confirmar Eliminación</h2>
                
                <div className="mb-4">
                    <p className="text-gray-700 mb-2">Está a punto de eliminar el siguiente juego:</p>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                        <p><strong>Nombre:</strong> {game.game_name}</p>
                        <p><strong>ID:</strong> {game.id_game}</p>
                        <p><strong>Editorial:</strong> {game.editor_nombre}</p>
                        <p><strong>Precio:</strong> ${game.precio_original}</p>
                    </div>
                    
                    <p className="mt-4 text-red-500 font-semibold">
                        ¿Está seguro que desea eliminar este juego? Esta acción no se puede deshacer.
                    </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirmDelete(game.id_game)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Eliminar Juego
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteGameModal;