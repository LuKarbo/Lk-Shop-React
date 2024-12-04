import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PurchaseApi } from '../../BackEnd/API/PurchasesAPI';
import { useAuth } from '../../BackEnd/Auth/AuthContext';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const MyPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const userId = localStorage.getItem('user');
    const accessToken = localStorage.getItem('token');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        const fetchPurchases = async () => {
            try {
                const purchaseData = await PurchaseApi.getById(userId, accessToken);
                
                setPurchases(purchaseData.data || []);
                setFilteredPurchases(purchaseData.data || []);
            } catch (error) {
                console.error('Error fetching purchases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [userId, accessToken]);

    useEffect(() => {
        const filtered = purchases.filter(purchase => 
            purchase.nombre_juego.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPurchases(filtered);
    }, [searchTerm, purchases]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Cargando compras...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 mt-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Historial de Compras</h1>
                    
                    <div className="mb-4">
                        <input 
                            type="text" 
                            placeholder="Buscar juegos..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='className="max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 pr-2'>
                    {filteredPurchases.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No se encontraron compras
                            {searchTerm && ` para "${searchTerm}"`}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredPurchases.map(purchase => (
                                <PurchaseItem 
                                    key={purchase.id_purchase} 
                                    purchase={purchase} 
                                />
                            ))}
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PurchaseItem = ({ purchase }) => (
    <div 
        className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition border-b last:border-b-0 border-gray-200"
    >
        <img 
            src={purchase.game_IMG || 'https://via.placeholder.com/280x160'} 
            alt={purchase.nombre_juego} 
            className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
            <h3 className="font-semibold text-lg">{purchase.nombre_juego}</h3>
            <p className="text-sm text-gray-600">{formatDate(purchase.fecha)}</p>
        </div>
        <div className="text-green-600 font-semibold text-lg">{purchase.precio}</div>
    </div>
);

export default MyPurchases;