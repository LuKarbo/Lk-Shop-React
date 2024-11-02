export const ViewTicketModal = ({ isOpen, onClose, ticket }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-lg font-semibold">Detalles de la Consulta</h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Consulta:</h4>
                            <p className="text-gray-600">{ticket?.content}</p>
                        </div>
                        {ticket?.response && (
                            <div>
                                <h4 className="font-semibold mb-2">Respuesta:</h4>
                                <p className="text-gray-600">{ticket.response}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ReplyTicketModal = ({ isOpen, onClose, ticket, replyContent, setReplyContent, onSubmit }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-lg font-semibold">Responder Consulta</h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Consulta original:</h4>
                            <p className="text-gray-600 mb-4">{ticket?.content}</p>
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Escribe tu respuesta aquí..."
                                className="w-full h-32 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 p-4 border-t">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={onSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Enviar Respuesta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
