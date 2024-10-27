import { useState } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
    const [isViewTicketOpen, setIsViewTicketOpen] = useState(false);
    const [isReplyTicketOpen, setIsReplyTicketOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [pendingSearch, setPendingSearch] = useState('');
    const [answeredSearch, setAnsweredSearch] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const [userPage, setUserPage] = useState(1);
    const [pendingPage, setPendingPage] = useState(1);
    const [answeredPage, setAnsweredPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: ''
    });

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

    const pendingTickets = [
        {
            id: 1,
            userName: 'Juan Pérez',
            date: '2024-03-20',
            content: 'No puedo acceder a mi juego',
        },
    ];

    const answeredTickets = [
        {
            id: 1,
            userName: 'María López',
            date: '2024-03-19',
            content: 'Problema con el pago',
            response: 'El pago ha sido procesado correctamente',
            answeredBy: 'Admin',
            answeredDate: '2024-03-20',
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
            user.role.toLowerCase().includes(userSearch.toLowerCase())
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

    const filteredPendingTickets = pendingTickets.filter(ticket =>
        ticket.userName.toLowerCase().includes(pendingSearch.toLowerCase())
    );

    const filteredAnsweredTickets = answeredTickets.filter(ticket =>
        ticket.userName.toLowerCase().includes(answeredSearch.toLowerCase())
    );

    // handlers
    const handleOpenEditModal = (user) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role
        });
        setIsEditModalOpen(true);
    };
    
    const handleOpenDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };
    
    const handleEditSubmit = () => {
        console.log('Usuario editado:', { ...selectedUser, ...editForm });
        setIsEditModalOpen(false);
    };
    
    const handleDeleteSubmit = () => {
        console.log('Usuario eliminado:', selectedUser);
        setIsDeleteModalOpen(false);
    };

    const handleOpenViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsViewTicketOpen(true);
    };

    const handleOpenReplyTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsReplyTicketOpen(true);
    };

    const handleReplySubmit = () => {
        console.log('Respuesta enviada:', replyContent);
        setReplyContent('');
        setIsReplyTicketOpen(false);
    };

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

    const paginatedPendingTickets = filteredPendingTickets.slice(
        (pendingPage - 1) * ITEMS_PER_PAGE,
        pendingPage * ITEMS_PER_PAGE
    );

    const paginatedAnsweredTickets = filteredAnsweredTickets.slice(
        (answeredPage - 1) * ITEMS_PER_PAGE,
        answeredPage * ITEMS_PER_PAGE
    );

    const handleUserSearch = (value) => {
        setUserSearch(value);
        setUserPage(1);
    };

    const handlePendingSearch = (value) => {
        setPendingSearch(value);
        setPendingPage(1);
    };

    const handleAnsweredSearch = (value) => {
        setAnsweredSearch(value);
        setAnsweredPage(1);
    };


    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

                {/* LISTAS */}

            {/* Lista de Usuarios */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Usuarios</h3>
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
                                    <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
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
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleOpenEditModal(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Pencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteModal(user)}
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
                        currentPage={userPage}
                        totalItems={filteredUsers.length}
                        setPage={setUserPage}
                    />
                </div>
            </div>

            {/* Consultas Pendientes */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Consultas Pendientes</h3>
                    <input
                        type="text"
                        placeholder="Buscar consultas pendientes..."
                        value={pendingSearch}
                        onChange={(e) => handlePendingSearch(e.target.value)}
                        className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-gray-600">Usuario</th>
                                <th className="px-6 py-3 text-left text-gray-600">Fecha</th>
                                <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedPendingTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{ticket.userName}</td>
                                <td className="px-6 py-4">{ticket.date}</td>
                                <td className="px-6 py-4 space-x-2">
                                    <button 
                                    onClick={() => handleOpenViewTicket(ticket)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                    >
                                    Ver
                                    </button>
                                    <button 
                                    onClick={() => handleOpenReplyTicket(ticket)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                    Responder
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={pendingPage}
                        totalItems={filteredPendingTickets.length}
                        setPage={setPendingPage}
                    />
                </div>
            </div>

            {/* Consultas Resueltas */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Consultas Respondidas</h3>
                    <input
                        type="text"
                        placeholder="Buscar consultas respondidas..."
                        value={answeredSearch}
                        onChange={(e) => handleAnsweredSearch(e.target.value)}
                        className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-gray-600">Usuario</th>
                                <th className="px-6 py-3 text-left text-gray-600">Fecha Consulta</th>
                                <th className="px-6 py-3 text-left text-gray-600">Respondido Por</th>
                                <th className="px-6 py-3 text-left text-gray-600">Fecha Respuesta</th>
                                <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedAnsweredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{ticket.userName}</td>
                                <td className="px-6 py-4">{ticket.date}</td>
                                <td className="px-6 py-4">{ticket.answeredBy}</td>
                                <td className="px-6 py-4">{ticket.answeredDate}</td>
                                <td className="px-6 py-4">
                                    <button 
                                    onClick={() => handleOpenViewTicket(ticket)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                    >
                                    Ver
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={answeredPage}
                        totalItems={filteredAnsweredTickets.length}
                        setPage={setAnsweredPage}
                    />
                </div>
            </div>

                {/* MODALS */}

            {/* Modal de consulta */}
            {isViewTicketOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsViewTicketOpen(false)} />
                        <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold">Detalles de la Consulta</h3>
                                <button 
                                    onClick={() => setIsViewTicketOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Consulta:</h4>
                                    <p className="text-gray-600">{selectedTicket?.content}</p>
                                </div>
                                {selectedTicket?.response && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Respuesta:</h4>
                                        <p className="text-gray-600">{selectedTicket.response}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de responder consulta */}
            {isReplyTicketOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsReplyTicketOpen(false)} />
                        <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold">Responder Consulta</h3>
                                <button 
                                    onClick={() => setIsReplyTicketOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Consulta original:</h4>
                                    <p className="text-gray-600 mb-4">{selectedTicket?.content}</p>
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
                                onClick={() => setIsReplyTicketOpen(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                Cancelar
                                </button>
                                <button 
                                onClick={handleReplySubmit}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                Enviar Respuesta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de editar usuario */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsEditModalOpen(false)} />
                        <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold">Editar Usuario</h3>
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rol
                                        </label>
                                        <select
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="usuario">Usuario</option>
                                            <option value="soporte">Soporte</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 p-4 border-t">
                                <button 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleEditSubmit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de eliminar usuario */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsDeleteModalOpen(false)} />
                        <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold">Confirmar Eliminación</h3>
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    ¿Estás seguro de que deseas eliminar al siguiente usuario?
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p><strong>ID:</strong> {selectedUser?.id}</p>
                                    <p><strong>Nombre:</strong> {selectedUser?.name}</p>
                                    <p><strong>Email:</strong> {selectedUser?.email}</p>
                                    <p><strong>Rol:</strong> {selectedUser?.role}</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 p-4 border-t">
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleDeleteSubmit}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Eliminar Usuario
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;