import { useState, useEffect, useCallback } from 'react';
import { UserApi } from '../../../BackEnd/API/UserApi';
import UserTable from './UserManagement-content/UserTable';
import EditModal from './UserManagement-content/EditModal';
import DeleteModal from './UserManagement-content/DeleteModal';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userSearch, setUserSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const ITEMS_PER_PAGE = 8;
    const accessToken = localStorage.getItem('token');

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const responseUser = await UserApi.getUsers(accessToken);
            const responsePermisos = await UserApi.getPermissions(accessToken);
            const responseStatus = await UserApi.getStatus(accessToken);
            setUsers(responseUser.user[0]);
            setPermissions(responsePermisos.user[0]);
            setStatuses(responseStatus.user[0]);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        return (sortConfig.direction === 'asc' ? 1 : -1) * (aValue > bValue ? 1 : -1);
    });

    const filteredUsers = sortedUsers.filter(user =>
        user.nombre.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleEditSubmit = async (editedUser) => {
        try {
            const response = await UserApi.adminUserEdit(editedUser.user_id,editedUser.nombre,editedUser.email,editedUser.id_permissions,editedUser.id_status,accessToken);
            
            if (response.success) {
                await fetchUsers();
                setIsEditModalOpen(false);
            } else {
                console.error('Error updating user:', response.message || 'Unknown error');
            }
        } catch (err) {
            console.error('Error updating user:', err.message);
        }
    };

    const handleDeleteSubmit = async (userToDelete) => {
        try {
            await UserApi.deleteUser(userToDelete,accessToken);
            await fetchUsers();
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading users: {error.message}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Usuarios</h3>
                <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <UserTable
                        users={paginatedUsers}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        onEdit={(user) => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                        }}
                        onDelete={(user) => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
                        }}
                        currentPage={currentPage}
                        totalItems={filteredUsers.length}
                        setPage={setCurrentPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                    />
                </div>
            </div>

            <EditModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                statuses={statuses}
                permissions={permissions}
                onSubmit={handleEditSubmit}
            />

            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                user={selectedUser}
                onConfirm={handleDeleteSubmit}
            />
        </div>
    );
};

export default UserManagement;