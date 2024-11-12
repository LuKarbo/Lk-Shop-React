const PurchaseHistory = ({ purchases, onViewAll }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Últimas Compras</h2>
                <button className="text-blue-500 hover:text-blue-600" onClick={onViewAll}>
                    Ver historial completo
                </button>
            </div>
            <div className="space-y-4">
                {purchases.slice(0, 3).map(purchase => (
                    <PurchaseItem key={purchase.id} purchase={purchase} />
                ))}
            </div>
        </div>
    );
};

const PurchaseItem = ({ purchase }) => (
    <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition">
        <img src={purchase.image} alt={purchase.game} className="w-16 h-16 rounded-lg" />
        <div className="flex-1">
            <h3 className="font-semibold">{purchase.game}</h3>
            <p className="text-sm text-gray-600">{purchase.date}</p>
        </div>
        <div className="text-green-600 font-semibold">{purchase.price}</div>
    </div>
);

export default PurchaseHistory;