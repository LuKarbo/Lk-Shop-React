const DeleteModal = ({ isOpen, onClose, user, onConfirm }) => {
    const userId = localStorage.getItem('user');

    if (!isOpen || !user) return null;

    const isSelfDelete = userId === user.id_user.toString();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Confirmar Eliminación</h2>
                <div className="space-y-4">
                    {isSelfDelete ? (
                        <p className="text-red-600 font-medium">No puedes eliminar tu propio usuario.</p>
                    ) : (
                        <>
                            <p className="text-gray-600">¿Estás seguro de que deseas eliminar este usuario?</p>
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p><span className="font-medium">ID:</span> {user.id_user}</p>
                                <p><span className="font-medium">Nombre:</span> {user.nombre}</p>
                                <p><span className="font-medium">Email:</span> {user.email}</p>
                                <p><span className="font-medium">Permisos:</span> {user.permissions_name}</p>
                                <p><span className="font-medium">Estado:</span> {user.status_name}</p>
                            </div>
                        </>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            if (!isSelfDelete) {
                                onConfirm(user.id_user);
                                onClose();
                            }
                        }}
                        disabled={isSelfDelete}
                        className={`px-4 py-2 rounded-md ${
                            isSelfDelete 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;