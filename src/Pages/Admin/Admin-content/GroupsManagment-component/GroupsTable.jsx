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

const GroupsTable = ({ 
    paginatedGroups, 
    sortConfig, 
    onSort, 
    onEdit, 
    onDelete,
    currentPage,
    totalItems,
    setPage,
    itemsPerPage
}) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-600">ID</th>
                            <SortableHeader column="group_name" label="Nombre" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader column="group_description" label="Descripción" sortConfig={sortConfig} onSort={onSort} />
                            <SortableHeader column="member_count" label="Miembros" sortConfig={sortConfig} onSort={onSort} />
                            <th className="px-6 py-3 text-left text-gray-600">Categorías</th>
                            <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedGroups.map((group) => (
                            <tr key={group.id_group} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{group.id_group}</td>
                                <td className="px-6 py-4">{group.group_name}</td>
                                <td className="px-6 py-4">
                                    <div className="max-w-md truncate">
                                        {group.group_description}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{group.member_count}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {group.categories && group.categories.split(', ').map((category, index) => (
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
                                            onClick={() => onEdit(group)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Pencil size={20} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(group)}
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
                ITEMS_PER_PAGE={itemsPerPage}
            />
        </div>
    );
};

export default GroupsTable;