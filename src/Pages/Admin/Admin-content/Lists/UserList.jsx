import { ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { Pagination } from '../Functions/Pagination';


const SortIndicator = ({ columnKey, sortConfig }) => {
    if (sortConfig.key !== columnKey) {
        return <ChevronUp className="opacity-0 group-hover:opacity-50 w-4 h-4 inline-block ml-1" />;
    }
    return sortConfig.direction === 'asc' 
        ? <ChevronUp className="w-4 h-4 inline-block ml-1 text-blue-500" />
        : <ChevronDown className="w-4 h-4 inline-block ml-1 text-blue-500" />;
};

const SortableHeader = ({ column, label, sortConfig, onSort }) => (
    <th 
        className="px-6 py-3 text-left text-gray-600 cursor-pointer group hover:bg-gray-100"
        onClick={() => onSort(column)}
    >
        <div className="flex items-center">
            {label}
            <SortIndicator columnKey={column} sortConfig={sortConfig} />
        </div>
    </th>
);

const UserList = ({
    users,
    searchValue,
    onSearchChange,
    currentPage,
    totalItems,
    setPage,
    sortConfig,
    onSort,
    onEditUser,
    onDeleteUser,
    itemsPerPage
}) => {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Usuarios</h3>
                <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-gray-600">ID</th>
                                <SortableHeader column="name" label="Nombre" sortConfig={sortConfig} onSort={onSort} />
                                <SortableHeader column="email" label="Email" sortConfig={sortConfig} onSort={onSort} />
                                <SortableHeader column="gamesCount" label="Juegos" sortConfig={sortConfig} onSort={onSort} />
                                <SortableHeader column="groupsCount" label="Grupos" sortConfig={sortConfig} onSort={onSort} />
                                <SortableHeader column="purchasesCount" label="Compras" sortConfig={sortConfig} onSort={onSort} />
                                <SortableHeader column="role" label="Rol" sortConfig={sortConfig} onSort={onSort} />
                                <SortableHeader column="status" label="Estado" sortConfig={sortConfig} onSort={onSort} />
                                <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{user.id}</td>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.gamesCount}</td>
                                    <td className="px-6 py-4">{user.groupsCount}</td>
                                    <td className="px-6 py-4">{user.purchasesCount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                            user.role === 'admin' 
                                            ? 'bg-blue-100 text-blue-800'
                                            : user.role === 'soporte' 
                                            ? 'bg-yellow-100 text-yellow-800'
                                            :'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                            user.status === 'online' 
                                            ? 'bg-green-100 text-green-800'
                                            : user.status === 'banned' 
                                            ? 'bg-red-100 text-red-800'
                                            :'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onEditUser(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Pencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => onDeleteUser(user)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    setPage={setPage}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </div>
    );
};

export default UserList;