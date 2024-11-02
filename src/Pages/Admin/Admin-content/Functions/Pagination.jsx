import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalItems, setPage, ITEMS_PER_PAGE }) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
            <div className="flex items-center">
                <p className="text-sm text-gray-700">
                    Mostrando
                    {' '}
                    <span className="font-medium">
                        {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)}
                    </span>
                    {' '}
                    a
                    {' '}
                    <span className="font-medium">
                        {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                    </span>
                    {' '}
                    de
                    {' '}
                    <span className="font-medium">{totalItems}</span>
                    {' '}
                    resultados
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