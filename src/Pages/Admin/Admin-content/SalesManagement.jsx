import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Download } from 'lucide-react';
import { Pagination } from './Functions/Pagination';
import { PurchaseApi } from '../../../BackEnd/API/PurchasesAPI';
import PurchaseTable from './SalesManagment-component/PurchaseTable';

const SalesManagement = () => {
    const [purchaseData, setPurchaseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchaseSearch, setPurchaseSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });
    const [purchasePage, setPurchasePage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const accessToken = localStorage.getItem('token');
                const data = await PurchaseApi.getAll(accessToken);
                
                setPurchaseData(data.data);
            } catch (error) {
                console.error('Error fetching purchases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

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
        purchaseData.filter(purchase => 
            purchase.nombre_usuario.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
            purchase.nombre_juego.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
            purchase.fecha.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
            purchase.precio.toLowerCase().includes(purchaseSearch.toLowerCase())
        )
    );

    const handleExportToExcel = async (fileName = 'historial_compras.xlsx') => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Historial de Compras');

        worksheet.columns = [
            { header: 'ID', key: 'id_purchase', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Usuario', key: 'nombre_usuario', width: 20 },
            { header: 'Juego', key: 'nombre_juego', width: 20 },
            { header: 'Precio', key: 'precio', width: 15 }
        ];

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        filteredPurchases.forEach(purchase => {
            worksheet.addRow({
                id_purchase: purchase.id_purchase,
                fecha: new Date(purchase.fecha).toLocaleString(),
                nombre_usuario: purchase.nombre_usuario,
                nombre_juego: purchase.nombre_juego,
                precio: purchase.precio
            });
        });

        worksheet.getColumn('precio').numFmt = '"$"#,##0.00';
        
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle' };
            });
        });

        try {
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            saveAs(blob, fileName);
        } catch (error) {
            console.error('Error al exportar el Excel:', error);
        }
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
    
    const paginatedPurchases = filteredPurchases.slice(
        (purchasePage - 1) * ITEMS_PER_PAGE,
        purchasePage * ITEMS_PER_PAGE
    );

    if (loading) {
        return <div className="text-center py-4">Cargando...</div>;
    }

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-6 sectionTitle">Historial de Compras</h2>

            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-xl font-semibold">Compras</h3>
                        <button
                            onClick={() => handleExportToExcel()}
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
                    <PurchaseTable 
                        paginatedPurchases={paginatedPurchases}
                        SortableHeader={SortableHeader}
                    />
                    <Pagination
                        currentPage={purchasePage}
                        totalItems={filteredPurchases.length}
                        setPage={setPurchasePage}
                        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    />
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;