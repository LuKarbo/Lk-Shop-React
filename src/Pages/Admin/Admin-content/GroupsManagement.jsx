import { useState, useEffect, useCallback } from 'react';
import { GroupsApi } from '../../../BackEnd/API/GroupsAPI';
import { GamesAPI } from '../../../BackEnd/API/GamesAPI';
import GroupsTable from './GroupsManagment-component/GroupsTable';
import EditGroupModal from './GroupsManagment-component/EditGroupModal';
import DeleteGroupModal from './GroupsManagment-component/DeleteGroupModal';

const GroupsManagement = () => {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupSearch, setGroupSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [groupPage, setGroupPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const ITEMS_PER_PAGE = 10;

    const fetchGroups = useCallback(async () => {
        setIsLoading(true);
        try {
            const accessToken = localStorage.getItem('token');
            const groupsData = await GroupsApi.getAllGroups(accessToken);
            const allCategories = await GamesAPI.getCategories();
            setCategories(allCategories.data);
            setGroups(groupsData.data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

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
        groups.filter((group) => {
            const groupName = group.group_name?.toLowerCase() || '';
            const groupDescription = group.group_description?.toLowerCase() || '';
            const groupCategories = Array.isArray(group.categories) 
                ? group.categories.some((category) =>
                    category.toLowerCase().includes(groupSearch.toLowerCase())
                ) 
                : false;
    
            return (
                groupName.includes(groupSearch.toLowerCase()) ||
                groupDescription.includes(groupSearch.toLowerCase()) ||
                groupCategories
            );
        })
    );
    
    

    const paginatedGroups = filteredGroups.slice(
        (groupPage - 1) * ITEMS_PER_PAGE,
        groupPage * ITEMS_PER_PAGE
    );

    const handleEditSubmit = async (editedGroup) => {
        try {
            const categoriesString = editedGroup.categories.join(',');
            const accessToken = localStorage.getItem('token');
    
            const updatedGroup = await GroupsApi.editGroup(editedGroup.id, editedGroup.name, editedGroup.description, '', categoriesString , accessToken);
    
            if (updatedGroup.success) {
                await fetchGroups();
                setIsEditModalOpen(false);
            } else {
                console.error('Error updating group:', updatedGroup.message || 'Unknown error');
            }
        } catch (err) {
            console.error('Error updating group:', err.message);
        }
    };

    const handleDeleteSubmit = async (groupToDelete) => {
        try {
            const accessToken = localStorage.getItem('token');
            await GroupsApi.deleteGroup(groupToDelete, accessToken);
            await fetchGroups();
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting group:', err);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading groups: {error.message}</div>;

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
                categories={categories}
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