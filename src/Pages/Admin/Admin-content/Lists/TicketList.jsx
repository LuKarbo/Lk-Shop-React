import { Pagination } from '../Functions/Pagination';

const TicketList = ({ 
    title, 
    tickets, 
    searchValue, 
    onSearchChange, 
    currentPage,
    totalItems,
    setPage,
    onViewTicket,
    onReplyTicket,
    showReplyButton = false,
    showAnsweredInfo = false,
    ITEMS_PER_PAGE = 10
}) => {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{title}</h3>
                <input
                    type="text"
                    placeholder={`Buscar ${title.toLowerCase()}...`}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-600">Usuario</th>
                            <th className="px-6 py-3 text-left text-gray-600">Fecha Consulta</th>
                            {showAnsweredInfo && (
                                <>
                                    <th className="px-6 py-3 text-left text-gray-600">Respondido Por</th>
                                    <th className="px-6 py-3 text-left text-gray-600">Fecha Respuesta</th>
                                </>
                            )}
                            <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{ticket.userName}</td>
                                <td className="px-6 py-4">{ticket.date}</td>
                                {showAnsweredInfo && (
                                    <>
                                        <td className="px-6 py-4">{ticket.answeredBy}</td>
                                        <td className="px-6 py-4">{ticket.answeredDate}</td>
                                    </>
                                )}
                                <td className="px-6 py-4 space-x-2">
                                    <button 
                                        onClick={() => onViewTicket(ticket)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                    >
                                        Ver
                                    </button>
                                    {showReplyButton && (
                                        <button 
                                            onClick={() => onReplyTicket(ticket)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Responder
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    setPage={setPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                />
            </div>
        </div>
    );
};

export default TicketList;