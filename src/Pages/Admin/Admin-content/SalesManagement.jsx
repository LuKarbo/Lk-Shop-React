import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Download } from 'lucide-react';

const SalesManagement = () => {
    const [purchaseSearch, setPurchaseSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [purchasePage, setPurchasePage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const purchases = [
        {
            id: 1,
            date: '2024-03-15',
            userName: 'Juan Pérez',
            userEmail: 'juan@example.com',
            gameName: 'Super Game 1',
            amount: 29.99,
            paymentMethod: 'credit_card',
            status: 'completed'
        },
        {
            id: 2,
            date: '2024-03-14',
            userName: 'María López',
            userEmail: 'maria@example.com',
            gameName: 'Adventure Quest',
            amount: 19.99,
            paymentMethod: 'paypal',
            status: 'completed'
        },
        {
            id: 3,
            date: '2024-03-14',
            userName: 'Tomas López',
            userEmail: 'tolop@example.com',
            gameName: 'Racing Simulator',
            amount: 49.99,
            paymentMethod: 'credit_card',
            status: 'refunded'
        },
        {
            id: 4,
            date: '2024-03-13',
            userName: 'Ana García',
            userEmail: 'ana@example.com',
            gameName: 'Strategy Master',
            amount: 39.99,
            paymentMethod: 'debit_card',
            status: 'pending'
        },
    ];

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setPurchasePage(1);
    };

    const sortPurchases = (purchasesToSort) => {
        if (!sortConfig.key) return purchasesToSort;

        return [...purchasesToSort].sort((a, b) => {
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

    const filteredPurchases = sortPurchases(
        purchases.filter(purchase => 
            purchase.userName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
            purchase.userEmail.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
            purchase.gameName.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
            purchase.status.toLowerCase().includes(purchaseSearch.toLowerCase())
        )
    );

    const handleExportToExcel = () => {
        // Creo el archivo y descargo
        const headers = ['ID', 'Fecha', 'Usuario', 'Email', 'Juego', 'Monto', 'Método de Pago', 'Estado'];
        const csvContent = [
            headers.join(','),
            ...filteredPurchases.map(purchase => [
                purchase.id,
                purchase.date,
                purchase.userName,
                purchase.userEmail,
                purchase.gameName,
                purchase.amount,
                purchase.paymentMethod,
                purchase.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'historial_compras.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const SortIndicator = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronUp className="opacity-0 group-hover:opacity-50 w-4 h-4 inline-block ml-1" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ChevronUp className="w-4 h-4 inline-block ml-1 text-blue-500" />
            : <ChevronDown className="w-4 h-4 inline-block ml-1 text-blue-500" />;
    };

    const SortableHeader = ({ column, label }) => (
        <th 
            className="px-6 py-3 text-left text-gray-600 cursor-pointer group hover:bg-gray-100"
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center">
                {label}
                <SortIndicator columnKey={column} />
            </div>
        </th>
    );

    const Pagination = ({ currentPage, totalItems, setPage }) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
                <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">
                            {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)}
                        </span>
                        {' '}a{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                        </span>
                        {' '}de{' '}
                        <span className="font-medium">{totalItems}</span>
                        {' '}resultados
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
    
    const paginatedPurchases = filteredPurchases.slice(
        (purchasePage - 1) * ITEMS_PER_PAGE,
        purchasePage * ITEMS_PER_PAGE
    );

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-6 sectionTitle">Historial de Compras</h2>

            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-xl font-semibold">Compras</h3>
                        <button
                            onClick={handleExportToExcel}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download size={20} className="mr-2" />
                            Exportar a Excel
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar compras..."
                        value={purchaseSearch}
                        onChange={(e) => setPurchaseSearch(e.target.value)}
                        className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-600">ID</th>
                                    <SortableHeader column="date" label="Fecha" />
                                    <SortableHeader column="userName" label="Usuario" />
                                    <SortableHeader column="userEmail" label="Email" />
                                    <SortableHeader column="gameName" label="Juego" />
                                    <SortableHeader column="amount" label="Monto" />
                                    <SortableHeader column="paymentMethod" label="Método de Pago" />
                                    <SortableHeader column="status" label="Estado" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedPurchases.map((purchase) => (
                                    <tr key={purchase.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{purchase.id}</td>
                                        <td className="px-6 py-4">{purchase.date}</td>
                                        <td className="px-6 py-4">{purchase.userName}</td>
                                        <td className="px-6 py-4">{purchase.userEmail}</td>
                                        <td className="px-6 py-4">{purchase.gameName}</td>
                                        <td className="px-6 py-4">${purchase.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                purchase.paymentMethod === 'credit_card'
                                                ? 'bg-blue-100 text-blue-800'
                                                : purchase.paymentMethod === 'paypal'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {
                                                    purchase.paymentMethod === 'credit_card' ? 'Tarjeta de Crédito' :
                                                    purchase.paymentMethod === 'paypal' ? 'PayPal' :
                                                    purchase.paymentMethod === 'debit_card' ? 'Tarjeta de Débito' :
                                                    purchase.paymentMethod
                                                }
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                purchase.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : purchase.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : purchase.status === 'refunded'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {
                                                    purchase.status === 'completed' ? 'Completado' :
                                                    purchase.status === 'pending' ? 'Pendiente' :
                                                    purchase.status === 'refunded' ? 'Reembolsado' :
                                                    purchase.status
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={purchasePage}
                        totalItems={filteredPurchases.length}
                        setPage={setPurchasePage}
                    />
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;