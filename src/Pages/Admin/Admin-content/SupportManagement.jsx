import { useState, useEffect, useCallback } from 'react';
import { SupportApi } from '../../../BackEnd/API/SuportAPI';
import RenderTicketTable from './TicketManagement-content/RenderTicketTable';
import ResponseModal from './TicketManagement-content/ResponseModal';

const SupportManagement = () => {
    const [unansweredTickets, setUnansweredTickets] = useState([]);
    const [answeredTickets, setAnsweredTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminResponse, setAdminResponse] = useState('');
    const [isViewMode, setIsViewMode] = useState(false);
    const [viewResponse, setViewResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [unansweredFilter, setUnansweredFilter] = useState('');
    const [answeredFilter, setAnsweredFilter] = useState('');

    const accessToken = localStorage.getItem('token');
    const userId = localStorage.getItem('user');

    const fetchTickets = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await SupportApi.getAll(accessToken);
            const tickets = response.data;
    
            const unanswered = tickets.filter(ticket => 
                !ticket.admin_name && !ticket.respuesta
            );
            const answered = tickets.filter(ticket => 
                ticket.admin_name && ticket.respuesta
            ).map(ticket => ({
                ...ticket,
                fecha_respuesta: new Date(ticket.fecha_respuesta || Date.now()).toLocaleString()
            }));
    
            setUnansweredTickets(unanswered);
            setAnsweredTickets(answered);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const openResponseModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
        setIsViewMode(false);
        setAdminResponse('');
    };

    const viewTicketResponse = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
        setIsViewMode(true);
        setViewResponse(ticket.respuesta || '');
    };

    const handleSubmitResponse = async () => {
        if (!selectedTicket || !adminResponse.trim()) {
            return;
        }
    
        try {
            await SupportApi.reply(selectedTicket.id_user_query, userId, adminResponse, accessToken);
    
            await fetchTickets();
    
            setIsModalOpen(false);
            setAdminResponse('');
        } catch (error) {
            console.error('Error al responder:', error);
        }
    };

    const filterTickets = (tickets, filterValue) => {
        const normalizedFilter = filterValue.toLowerCase();
        return tickets.filter(ticket => 
            (ticket.user_name && ticket.user_name.toLowerCase().includes(normalizedFilter)) ||
            (ticket.titulo && ticket.titulo.toLowerCase().includes(normalizedFilter)) ||
            (ticket.contenido && ticket.contenido.toLowerCase().includes(normalizedFilter))
        );
    };

    if (isLoading) {
        return <div>Cargando tickets...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Gestión de Soporte</h1>
        
            <RenderTicketTable 
                tickets={filterTickets(unansweredTickets, unansweredFilter)} 
                title="Consultas Pendientes" 
                isUnanswered={true} 
                onRespond={openResponseModal}
                filterValue={unansweredFilter}
                onFilterChange={(e) => setUnansweredFilter(e.target.value)}
            />
            
            <RenderTicketTable 
                tickets={filterTickets(answeredTickets, answeredFilter)} 
                title="Consultas Respondidas" 
                onViewResponse={viewTicketResponse}
                filterValue={answeredFilter}
                onFilterChange={(e) => setAnsweredFilter(e.target.value)}
            />
        
            <ResponseModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitResponse}
                selectedTicket={selectedTicket}
                adminResponse={adminResponse}
                onResponseChange={(e) => setAdminResponse(e.target.value)}
                isViewMode={isViewMode}
                viewResponse={viewResponse}
            />
        </div>
    );
};

export default SupportManagement;