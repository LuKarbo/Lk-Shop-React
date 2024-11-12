const PurchaseTable = ({
  paginatedPurchases,
  SortableHeader,
}) => {
  return (
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
  );
};

export default PurchaseTable;