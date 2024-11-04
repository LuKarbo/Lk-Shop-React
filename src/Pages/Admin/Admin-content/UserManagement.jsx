import { useState } from 'react';
import { users } from './Data/userData';
import { pendingTickets, answeredTickets } from './Data/ticketsData';
import { ViewTicketModal, ReplyTicketModal } from './Modals/TicketModals';
import { EditUserModal, DeleteUserModal } from './Modals/UserModal';
import TicketList from './Lists/TicketList';
import UserList from './Lists/UserList';


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
    const ITEMS_PER_PAGE = 8;

    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: ''
    });

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

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-6 sectionTitle">Gestión de Usuarios</h2>

                {/* LISTAS */}

            {/* Lista de Usuarios */}
            <UserList
                users={paginatedUsers}
                searchValue={userSearch}
                onSearchChange={setUserSearch}
                currentPage={userPage}
                totalItems={filteredUsers.length}
                setPage={setUserPage}
                sortConfig={sortConfig}
                onSort={sortUsers}
                onEditUser={handleOpenEditModal}
                onDeleteUser={handleOpenDeleteModal}
            />

            {/* Consultas Pendientes */}
            <TicketList
                title="Consultas Pendientes"
                tickets={paginatedPendingTickets}
                searchValue={pendingSearch}
                onSearchChange={setPendingSearch}
                currentPage={pendingPage}
                totalItems={filteredPendingTickets.length}
                setPage={setPendingPage}
                onViewTicket={handleOpenViewTicket}
                onReplyTicket={handleOpenReplyTicket}
                showReplyButton={true}
            />

            {/* Consultas Respondidas */}
            <TicketList
                title="Consultas Respondidas"
                tickets={paginatedAnsweredTickets}
                searchValue={answeredSearch}
                onSearchChange={setAnsweredSearch}
                currentPage={answeredPage}
                totalItems={filteredAnsweredTickets.length}
                setPage={setAnsweredPage}
                onViewTicket={handleOpenViewTicket}
                showAnsweredInfo={true}
            />

            {/* MODALS */}
            <ViewTicketModal 
                isOpen={isViewTicketOpen}
                onClose={() => setIsViewTicketOpen(false)}
                ticket={selectedTicket}
            />
            <ReplyTicketModal 
                isOpen={isReplyTicketOpen}
                onClose={() => setIsReplyTicketOpen(false)}
                ticket={selectedTicket}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                onSubmit={handleReplySubmit}
            />

            {/* Modal de editar usuario */}
            <EditUserModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                editForm={editForm}
                setEditForm={setEditForm}
                onSubmit={handleEditSubmit}
            />

            {/* Modal de eliminar usuario */}
            <DeleteUserModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                user={selectedUser}
                onSubmit={handleDeleteSubmit}
            />
        </div>
    );
};

export default UserManagement;