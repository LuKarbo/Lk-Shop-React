import { useState } from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

const GroupsManagement = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupSearch, setGroupSearch] = useState('');
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        categories: []
    });

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const [groupPage, setGroupPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Sample data
    const groups = [
        {
            id: 1,
            name: "Gamers Elite",
            description: "Grupo dedicado a jugadores competitivos de diversos géneros",
            image: "https://via.placeholder.com/800x600",
            members: 156,
            categories: ["Acción", "Shooter"]
        },
        {
            id: 2,
            name: "Casual Gaming",
            description: "Para jugadores que disfrutan de sesiones relajadas y amistosas",
            image: "https://via.placeholder.com/800x600",
            members: 89,
            categories: ["Aventura", "Puzzle"]
        }
    ];

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setGroupPage(1);
    };

    const sortGroups = (groupsToSort) => {
        if (!sortConfig.key) return groupsToSort;

        return [...groupsToSort].sort((a, b) => {
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

    const filteredGroups = sortGroups(
        groups.filter(group => 
            group.name.toLowerCase().includes(groupSearch.toLowerCase()) ||
            group.description.toLowerCase().includes(groupSearch.toLowerCase()) ||
            group.categories.some(category => 
                category.toLowerCase().includes(groupSearch.toLowerCase())
            )
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

    const handleOpenEditModal = (group) => {
        setSelectedGroup(group);
        setEditForm({
            name: group.name,
            description: group.description,
            categories: [...group.categories]
        });
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (group) => {
        setSelectedGroup(group);
        setIsDeleteModalOpen(true);
    };

    const handleEditSubmit = () => {
        console.log('Grupo editado:', { ...selectedGroup, ...editForm });
        setIsEditModalOpen(false);
    };

    const handleDeleteSubmit = () => {
        console.log('Grupo eliminado:', selectedGroup);
        setIsDeleteModalOpen(false);
    };

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

    const paginatedGroups = filteredGroups.slice(
        (groupPage - 1) * ITEMS_PER_PAGE,
        groupPage * ITEMS_PER_PAGE
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Gestión de Grupos</h2>

            {/* Groups List */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Grupos</h3>
                    <input
                        type="text"
                        placeholder="Buscar grupos..."
                        value={groupSearch}
                        onChange={(e) => setGroupSearch(e.target.value)}
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
                                    <SortableHeader column="description" label="Descripción" />
                                    <SortableHeader column="members" label="Miembros" />
                                    <th className="px-6 py-3 text-left text-gray-600">Categorías</th>
                                    <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedGroups.map((group) => (
                                    <tr key={group.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{group.id}</td>
                                        <td className="px-6 py-4">{group.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-md truncate">
                                                {group.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{group.members}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {group.categories.map((category, index) => (
                                                    <span 
                                                        key={index}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                    >
                                                        {category}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(group)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDeleteModal(group)}
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
                        currentPage={groupPage}
                        totalItems={filteredGroups.length}
                        setPage={setGroupPage}
                    />
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsEditModalOpen(false)} />
                        <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold">Editar Grupo</h3>
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
                                            Descripción
                                        </label>
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Categorías (separadas por coma)
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.categories.join(', ')}
                                            onChange={(e) => setEditForm({
                                                ...editForm, 
                                                categories: e.target.value.split(',').map(cat => cat.trim())
                                            })}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
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

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsDeleteModalOpen(false)} />
                        <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold">Eliminar Grupo</h3>
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700">
                                    ¿Estás seguro de que deseas eliminar el grupo `{selectedGroup?.name}`? 
                                    Esta acción no se puede deshacer.
                                </p>
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
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupsManagement;