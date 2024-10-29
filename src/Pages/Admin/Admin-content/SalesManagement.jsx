import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

const SalesManagement = () => {
    const [userSearch, setUserSearch] = useState('');

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const [userPage, setUserPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const users = [
        {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan@example.com',
            gamesCount: 5,
            groupsCount: 2,
            purchasesCount: 8,
            role: 'usuario',
            status: 'online',
        },
        {
            id: 2,
            name: 'María López',
            email: 'maria@example.com',
            gamesCount: 3,
            groupsCount: 1,
            purchasesCount: 4,
            role: 'soporte',
            status: 'offline',
        },
        {
            id: 3,
            name: 'Tomas López',
            email: 'tolop@example.com',
            gamesCount: 12,
            groupsCount: 3,
            purchasesCount: 12,
            role: 'admin',
            status: 'offline',
        },
        {
            id: 4,
            name: 'asdasd',
            email: 'asdasd@example.com',
            gamesCount: 0,
            groupsCount: 0,
            purchasesCount: 0,
            role: 'usuario',
            status: 'banned',
        },
    ];

    // filtro de header
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setUserPage(1);
    };

    // filtro de header
    const sortUsers = (usersToSort) => {
        if (!sortConfig.key) return usersToSort;

        return [...usersToSort].sort((a, b) => {
            if (a[sortConfig.key] === null) return 1;
            if (b[sortConfig.key] === null) return -1;

            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Filtros
    const filteredUsers = sortUsers(
        users.filter(user => 
            user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.role.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.status.toLowerCase().includes(userSearch.toLowerCase())
        )
    );

    const SortIndicator = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronUp className="opacity-0 group-hover:opacity-50 w-4 h-4 inline-block ml-1" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ChevronUp className="w-4 h-4 inline-block ml-1 text-blue-500" />
            : <ChevronDown className="w-4 h-4 inline-block ml-1 text-blue-500" />;
    };

    const SortableHeader = ({ column, label }) => (
        <th 
            className="px-6 py-3 text-left text-gray-600 cursor-pointer group hover:bg-gray-100"
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center">
                {label}
                <SortIndicator columnKey={column} />
            </div>
        </th>
    );


    // paginado y filtros del paginado
    const Pagination = ({ currentPage, totalItems, setPage }) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
                <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">
                            {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)}
                        </span>
                        {' '}a{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                        </span>
                        {' '}de{' '}
                        <span className="font-medium">{totalItems}</span>
                        {' '}resultados
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                            currentPage === 1
                            ? 'text-gray-400 bg-gray-100'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                            currentPage === totalPages
                            ? 'text-gray-400 bg-gray-100'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };
    
    const paginatedUsers = filteredUsers.slice(
        (userPage - 1) * ITEMS_PER_PAGE,
        userPage * ITEMS_PER_PAGE
    );

    const handleUserSearch = (value) => {
        setUserSearch(value);
        setUserPage(1);
    };


    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-6 sectionTitle">Historial de Compras</h2>

            {/* Lista de Usuarios */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Compras</h3>
                    <input
                        type="text"
                        placeholder="Buscar usuarios..."
                        value={userSearch}
                        onChange={(e) => handleUserSearch(e.target.value)}
                        className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-600">ID</th>
                                    <SortableHeader column="name" label="Nombre" />
                                    <SortableHeader column="email" label="Email" />
                                    <SortableHeader column="gamesCount" label="Juegos" />
                                    <SortableHeader column="groupsCount" label="Grupos" />
                                    <SortableHeader column="purchasesCount" label="Compras" />
                                    <SortableHeader column="role" label="Rol" />
                                    <SortableHeader column="status" label="Estado" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedUsers.map((user) => (
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
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={userPage}
                        totalItems={filteredUsers.length}
                        setPage={setUserPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;