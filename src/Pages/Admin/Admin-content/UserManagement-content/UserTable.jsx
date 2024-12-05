import { ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react';

const UserTable = ({ users, sortConfig, onSort, onEdit, onDelete }) => {
    const getStatusBadgeStyle = (status) => {
        switch (status) {
        case 'Online': return 'bg-green-100 text-green-800';
        case 'Offline': return 'bg-gray-100 text-gray-800';
        case 'Banned': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPermissionStyle = (permission) => {
        switch (permission) {
        case 'Admin': return 'bg-yellow-100 text-yellow-800';
        case 'Support': return 'bg-green-100 text-green-800';
        case 'User': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
        }
    };

    const SortIndicator = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
        return <ChevronUp className="opacity-0 group-hover:opacity-50 w-4 h-4 inline-block ml-1" />;
        }
        return sortConfig.direction === 'asc' 
        ? <ChevronUp className="w-4 h-4 inline-block ml-1 text-blue-500" />
        : <ChevronDown className="w-4 h-4 inline-block ml-1 text-blue-500" />;
    };

    return (
        <table className="w-full">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-gray-600">ID</th>
                <th className="px-6 py-3 text-left text-gray-600 cursor-pointer group" onClick={() => onSort('nombre')}>
                    <div className="flex items-center">
                    Nombre
                    <SortIndicator columnKey="nombre" />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-gray-600 cursor-pointer group" onClick={() => onSort('email')}>
                    <div className="flex items-center">
                    Email
                    <SortIndicator columnKey="email" />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-gray-600">Avatar</th>
                <th className="px-6 py-3 text-left text-gray-600 cursor-pointer group" onClick={() => onSort('status_name')}>
                    <div className="flex items-center">
                    Estado
                    <SortIndicator columnKey="status_name" />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-gray-600 cursor-pointer group" onClick={() => onSort('permissions_name')}>
                    <div className="flex items-center">
                    Permisos
                    <SortIndicator columnKey="permissions_name" />
                    </div>
                </th>
                <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                    <tr key={user.id_user} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{user.id_user}</td>
                        <td className="px-6 py-4">{user.nombre}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                        <img 
                            src={user.profileIMG || 'https://via.placeholder.com/280x160'} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        </td>
                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeStyle(user.status_name)}`}>
                            {user.status_name}
                        </span>
                        </td>
                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${getPermissionStyle(user.permissions_name)}`}>
                            {user.permissions_name}
                        </span>
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex space-x-2">
                            <button onClick={() => onEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Pencil size={20} />
                            </button>
                            <button onClick={() => onDelete(user)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={20} />
                            </button>
                        </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;