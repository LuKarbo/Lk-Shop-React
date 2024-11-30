import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { SupportApi } from '../../BackEnd/API/SuportAPI';

const MySupport = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pending');
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    const { isLoggedIn } = useAuth();
    const userId = localStorage.getItem('user');
    const accessToken = localStorage.getItem('token');
    const itemsPerPage = 10;

    const fetchTickets = useCallback(async (currentPage) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await SupportApi.getById(userId, accessToken, {
                page: currentPage,
                limit: itemsPerPage
            });
            
            const newTickets = response.data;
            
            setTickets(prevTickets => 
                currentPage === 1 ? newTickets : [...prevTickets, ...newTickets]
            );
            
            setHasMore(newTickets.length === itemsPerPage);
        } catch (err) {
            setError('Error al cargar las consultas. Por favor, intente nuevamente.');
            console.error('Error fetching tickets:', err);
        } finally {
            setIsLoading(false);
        }
    }, [userId, accessToken]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        fetchTickets(1);
    }, [isLoggedIn, navigate, fetchTickets]);

    const loadMoreTickets = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTickets(nextPage);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
    };

    const filterTickets = (tickets) => {
        return tickets.filter(ticket => {
            const searchTerm = searchQuery.toLowerCase();
            return (
                ticket.titulo.toLowerCase().includes(searchTerm) ||
                ticket.contenido.toLowerCase().includes(searchTerm)
            );
        });
    };

    const pendingTickets = filterTickets(
        tickets.filter(ticket => !ticket.admin_name && ticket.query_status === "En Espera")
    );
    const answeredTickets = filterTickets(
        tickets.filter(ticket => ticket.admin_name)
    );

    const filteredPendingTickets = filterTickets(
        tickets.filter(ticket => !ticket.admin_name && ticket.query_status === "En Espera")
    );
    const filteredAnsweredTickets = filterTickets(
        tickets.filter(ticket => ticket.admin_name)
    );

    const displayTickets = activeTab === 'pending' 
        ? filteredPendingTickets 
        : filteredAnsweredTickets;

    if (isLoading) {
        return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
            </div>
        </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
            <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
            </svg>
            </button>
            <h1 className="text-2xl font-bold">Mis Consultas de Soporte</h1>
        </div>

        <div className="mb-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg 
                        className="h-5 w-5 text-gray-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        aria-hidden="true"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por título o contenido..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
        </div>

        <div className="flex space-x-4 mb-6">
            <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'pending' 
                ? 'bg-yellow-100 text-orange-700' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
            </svg>
            <span>En Espera ({pendingTickets.length})</span>
            </button>
            <button
            onClick={() => setActiveTab('answered')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'answered' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
            </svg>
            <span>Respondidas ({answeredTickets.length})</span>
            </button>
        </div>
        <div 
                className="grid gap-4 max-h-[600px] overflow-y-auto" 
                onScroll={(e) => {
                    const { scrollTop, clientHeight, scrollHeight } = e.target;
                    if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoading) {
                        loadMoreTickets();
                    }
                }}
            >
                {displayTickets.map((ticket) => (
                    <div 
                    key={ticket.id_user_query} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                    <div className="p-4">
                    <div className="flex items-center justify-between pb-2">
                        <h3 className="text-lg font-semibold">
                        {ticket.titulo}
                        </h3>
                        <span 
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ticket.query_status === "En Espera" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }`}
                        >
                        {ticket.query_status}
                        </span>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                        <p className="text-sm text-gray-500">
                            Creado el {formatDate(ticket.fecha_creacion)}
                        </p>
                        <p className="mt-2">{ticket.contenido}</p>
                        </div>
                        
                        {ticket.admin_name && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">
                                Respuesta de {ticket.admin_name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {formatDate(ticket.fecha_respuesta)}
                            </p>
                            </div>
                            <p className="bg-gray-50 p-3 rounded-lg">
                            {ticket.respuesta}
                            </p>
                        </div>
                        )}
                    </div>
                    </div>
                </div>
                ))}
            </div>

            {isLoading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
                </div>
            )}

        {((activeTab === 'pending' && pendingTickets.length === 0) || 
            (activeTab === 'answered' && answeredTickets.length === 0)) && (
            <div className="text-center py-12">
            <p className="text-gray-500">
                {searchQuery 
                    ? `No se encontraron consultas ${activeTab === 'pending' ? 'pendientes' : 'respondidas'} que coincidan con tu búsqueda`
                    : `No hay consultas ${activeTab === 'pending' ? 'pendientes' : 'respondidas'} en este momento`
                }
            </p>
            </div>
        )}
        </div>
    );
};

export default MySupport;