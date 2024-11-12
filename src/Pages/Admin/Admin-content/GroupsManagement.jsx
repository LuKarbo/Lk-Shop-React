import { useState } from 'react';
import { groups } from '../../../BackEnd/Data/groups';
import GroupsTable from './GroupsManagment-component/GroupsTable';
import EditGroupModal from './GroupsManagment-component/EditGroupModal';
import DeleteGroupModal from './GroupsManagment-component/DeleteGroupModal';

const GroupsManagement = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupSearch, setGroupSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [groupPage, setGroupPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

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

    const paginatedGroups = filteredGroups.slice(
        (groupPage - 1) * ITEMS_PER_PAGE,
        groupPage * ITEMS_PER_PAGE
    );

    const handleEditSubmit = (editedGroup) => {
        console.log('Grupo editado:', { ...selectedGroup, ...editedGroup });
        setIsEditModalOpen(false);
    };

    const handleDeleteSubmit = (groupToDelete) => {
        console.log('Grupo eliminado:', groupToDelete);
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Gestión de Grupos</h2>

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

                <GroupsTable 
                    paginatedGroups={paginatedGroups}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onEdit={(group) => {
                        setSelectedGroup(group);
                        setIsEditModalOpen(true);
                    }}
                    onDelete={(group) => {
                        setSelectedGroup(group);
                        setIsDeleteModalOpen(true);
                    }}
                    currentPage={groupPage}
                    totalItems={filteredGroups.length}
                    setPage={setGroupPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>

            <EditGroupModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                group={selectedGroup}
                onSubmit={handleEditSubmit}
            />

            <DeleteGroupModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                group={selectedGroup}
                onSubmit={handleDeleteSubmit}
            />
        </div>
    );
};

export default GroupsManagement;