import { useState, useEffect } from 'react';

const EditModal = ({ isOpen, onClose, user, onSubmit, statuses, permissions }) => {
    const userId = localStorage.getItem('user');
    
    const [formData, setFormData] = useState({
        user_id: 0,
        nombre: '',
        email: '',
        id_permissions: 1,
        id_status: 2
    });

    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        if (user) {
            const currentPermission = permissions.find(p => p.nombre === user.permissions_name);
            const currentStatus = statuses.find(s => s.nombre === user.status_name);

            setFormData({
                user_id: user.id_user,
                nombre: user.nombre || '',
                email: user.email || '',
                id_permissions: currentPermission ? currentPermission.id_permissions : 1,
                id_status: currentStatus ? currentStatus.id_status : 2
            });

            setIsCurrentUser(user.id_user === parseInt(userId));
        }
    }, [user, statuses, permissions, userId]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const availableStatuses = isCurrentUser 
        ? statuses.filter(status => status.nombre !== 'Banned')
        : statuses;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>
                <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Permisos</label>
                    <select
                        value={formData.id_permissions}
                        onChange={(e) => setFormData({...formData, id_permissions: parseInt(e.target.value)})}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        disabled={isCurrentUser}
                    >
                        {permissions?.map((perm) => (
                            <option key={perm.id_permissions} value={perm.id_permissions}>
                                {perm.nombre}
                            </option>
                        ))}
                    </select>
                    {isCurrentUser && (
                        <p className="text-sm text-red-500 mt-1">No puedes cambiar tus propios permisos</p>
                    )}
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                        value={formData.id_status}
                        onChange={(e) => setFormData({...formData, id_status: parseInt(e.target.value)})}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                        {availableStatuses?.map((status) => (
                            <option key={status.id_status} value={status.id_status}>
                                {status.nombre}
                            </option>
                        ))}
                    </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                        >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                        Guardar
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;