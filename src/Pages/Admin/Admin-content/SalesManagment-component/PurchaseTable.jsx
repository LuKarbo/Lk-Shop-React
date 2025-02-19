const PurchaseTable = ({ paginatedPurchases, SortableHeader }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-gray-600">ID</th>
            <SortableHeader column="fecha" label="Fecha" />
            <SortableHeader column="nombre_usuario" label="Usuario" />
            <SortableHeader column="nombre_juego" label="Juego" />
            <SortableHeader column="precio" label="Precio" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginatedPurchases.map((purchase) => (
            <tr key={purchase.id_purchase} className="hover:bg-gray-50">
              <td className="px-6 py-4">{purchase.id_purchase}</td>
              <td className="px-6 py-4">{new Date(purchase.fecha).toLocaleString()}</td>
              <td className="px-6 py-4">{purchase.nombre_usuario}</td>
              <td className="px-6 py-4">{purchase.nombre_juego}</td>
              <td className="px-6 py-4">${parseFloat(purchase.precio).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;