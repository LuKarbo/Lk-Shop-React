import { useState, useEffect } from 'react';
import { Pagination } from '../Functions/Pagination';

const RenderTicketTable = ({ 
    tickets, 
    title, 
    isUnanswered = false, 
    onRespond, 
    onViewResponse,
    filterValue,
    onFilterChange
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    
    useEffect(() => {
        setCurrentPage(1);
    }, [filterValue]);

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-200 p-3 flex justify-between items-center">
                <span className="font-bold">{title}</span>
                <input 
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={filterValue}
                    onChange={onFilterChange}
                    className="border rounded px-2 py-1"
                />
            </div>

            {tickets.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                    No hay tickets que coincidan con el filtro
                </div>
            ) : (
                <>
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Título</th>
                                <th className="p-3 text-left">Contenido</th>
                                <th className="p-3 text-left">Usuario</th>
                                <th className="p-3 text-left">Fecha Creación</th>
                                {isUnanswered ? (
                                    <th className="p-3 text-left">Acciones</th>
                                ) : (
                                    <>
                                        <th className="p-3 text-left">Fecha Respuesta</th>
                                        <th className="p-3 text-left">Admin</th>
                                        <th className="p-3 text-left">Respuesta</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentTickets.map((ticket) => (
                                <tr key={ticket.id_user_query} className="border-b hover:bg-gray-50">
                                    <td className="p-3 truncate max-w-[200px]">{ticket.titulo}</td>
                                    <td className="p-3 truncate max-w-[300px]">{ticket.contenido}</td>
                                    <td className="p-3">{ticket.user_name}</td>
                                    <td className="p-3">{new Date(ticket.fecha_creacion).toLocaleString()}</td>
                                    {isUnanswered ? (
                                        <td className="p-3">
                                            <button 
                                                onClick={() => onRespond && onRespond(ticket)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Responder
                                            </button>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="p-3">{ticket.fecha_respuesta}</td>
                                            <td className="p-3">{ticket.admin_name}</td>
                                            <td className="p-3">
                                                <button 
                                                    onClick={() => onViewResponse && onViewResponse(ticket)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                >
                                                    Ver Respuesta
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={tickets.length}
                        setPage={setCurrentPage}
                        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    />
                </>
            )};
        </div>
    );
};

export default RenderTicketTable;