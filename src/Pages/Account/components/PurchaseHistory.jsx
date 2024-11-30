
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

const PurchaseHistory = ({ purchases, onViewAll }) => {
    const sortedPurchases = [...purchases].sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return dateB - dateA;  // Orden descendente
    });

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Últimas Compras</h2>
                <button className="text-blue-500 hover:text-blue-600" onClick={onViewAll}>
                    Ver historial completo
                </button>
            </div>
            <div className="space-y-4">
                {sortedPurchases.slice(0, 3).map(purchase => (
                    <PurchaseItem key={purchase.id_purchase} purchase={purchase} />
                ))}
            </div>
        </div>
    );
};

const PurchaseItem = ({ purchase }) => (
    <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition">
        <img src={purchase.game_IMG || 'https://via.placeholder.com/280x160' } alt={purchase.nombre_juego} className="w-16 h-16 rounded-lg" />
        <div className="flex-1">
            <h3 className="font-semibold">{purchase.nombre_juego}</h3>
            <p className="text-sm text-gray-600">{formatDate(purchase.fecha)}</p>
        </div>
        <div className="text-green-600 font-semibold">{purchase.precio}</div>
    </div>
);

export default PurchaseHistory;