import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { DiscountApi } from '../../../../BackEnd/API/DiscountAPI';
import { Pagination } from '../Functions/Pagination';
import DiscountModal from './DiscountModal';

const DiscountManagement = ({ discounts = [], setDiscounts, refreshData }) => {
  const [discountSearch, setDiscountSearch] = useState('');
  const [discountPage, setDiscountPage] = useState(1);
  const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const ITEMS_PER_PAGE = 8;

  const handleSubmit = async (formData) => {
      const accessToken = localStorage.getItem('token');
      try {
          if (currentDiscount) {
              await DiscountApi.edit(
                  currentDiscount.id_discount_code,
                  formData.codigo,
                  currentDiscount.id_discount_status,
                  new Date().toISOString(),
                  formData.fecha_finalizacion,
                  formData.procentaje,
                  accessToken
              );
          } else {
              await DiscountApi.create(
                  formData.codigo,
                  new Date().toISOString(),
                  formData.fecha_finalizacion,
                  formData.procentaje,
                  accessToken
              );
          }
          await refreshData();
          setIsAddDiscountModalOpen(false);
      } catch (error) {
          console.error('Error:', error);
      }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Caducado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenEditDiscountModal = (discount) => {
    setCurrentDiscount(discount);
    setIsAddDiscountModalOpen(true);
  };

  const filteredDiscountCodes = discounts?.filter(discount => 
    discount?.codigo?.toLowerCase().includes(discountSearch.toLowerCase())
  ) || [];

  const paginatedDiscountCodes = filteredDiscountCodes.slice(
    (discountPage - 1) * ITEMS_PER_PAGE, 
    discountPage * ITEMS_PER_PAGE
  );


  return (
    <>
        <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold">Códigos de Descuento</h3>
          <button
            onClick={() => {
              setCurrentDiscount(null);
              setIsAddDiscountModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Descuento Nuevo
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar códigos..."
          value={discountSearch}
          onChange={(e) => setDiscountSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">ID</th>
                <th className="px-6 py-3 text-left text-gray-600">Código</th>
                <th className="px-6 py-3 text-left text-gray-600">Fecha Creación</th>
                <th className="px-6 py-3 text-left text-gray-600">% de Descuento</th>
                <th className="px-6 py-3 text-left text-gray-600">Fecha Finalización</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedDiscountCodes.map((discount) => (
                <tr key={discount.id_discount_code} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{discount.id_discount_code}</td>
                  <td className="px-6 py-4">{discount.codigo}</td>
                  <td className="px-6 py-4">
                    {new Date(discount.fecha_creacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{discount.procentaje}%</td>
                  <td className="px-6 py-4">
                    {new Date(discount.fecha_finalizacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(discount.status_nombre)}`}>
                      {discount.status_nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenEditDiscountModal(discount)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={discountPage}
          totalItems={filteredDiscountCodes.length}
          setPage={setDiscountPage}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        />
      </div>
    </div>
    <DiscountModal 
    isOpen={isAddDiscountModalOpen}
    onClose={() => setIsAddDiscountModalOpen(false)}
    onSubmit={handleSubmit}
    currentDiscount={currentDiscount}
    />
    </>

  );
};

export default DiscountManagement;