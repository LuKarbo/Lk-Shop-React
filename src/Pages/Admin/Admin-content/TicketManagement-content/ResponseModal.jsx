const ResponseModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    selectedTicket, 
    adminResponse, 
    onResponseChange,
    isViewMode = false,
    viewResponse = ''
}) => {
    if (!isOpen || !selectedTicket) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {isViewMode ? 'Respuesta de la Consulta' : 'Responder Consulta'}
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Título:</label>
                    <p className="text-gray-800">{selectedTicket.titulo}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Contenido:</label>
                    <p className="text-gray-800">{selectedTicket.contenido}</p>
                </div>
                {isViewMode ? (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Respuesta:</label>
                        <p className="text-gray-800">{viewResponse}</p>
                    </div>
                ) : (
                    <textarea
                        className="w-full p-2 border rounded-md h-32 focus:ring-2 focus:ring-blue-300"
                        placeholder="Escribe tu respuesta aquí..."
                        value={adminResponse}
                        onChange={onResponseChange}
                        maxLength={500}
                    />
                )}
                <div className="flex justify-end space-x-2 mt-4">
                    <button 
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cerrar
                    </button>
                    {!isViewMode && (
                        <button 
                            onClick={onSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!adminResponse.trim()}
                        >
                            Enviar Respuesta
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResponseModal;