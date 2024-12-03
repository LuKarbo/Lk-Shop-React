import { useState, useEffect } from 'react';

const DiscountModal = ({ isOpen, onClose, onSubmit, currentDiscount }) => {
    const [formData, setFormData] = useState({
        codigo: '',
        procentaje: '',
        fecha_finalizacion: '',
    });

    useEffect(() => {
        if (currentDiscount) {
        setFormData({
            codigo: currentDiscount.codigo,
            procentaje: currentDiscount.procentaje,
            fecha_finalizacion: new Date(currentDiscount.fecha_finalizacion)
            .toISOString()
            .split('T')[0],
        });
        } else {
            setFormData({
                codigo: '',
                procentaje: '',
                fecha_finalizacion: '',
            });
        }
    }, [currentDiscount]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            procentaje: parseFloat(formData.procentaje),
        });
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">
                {currentDiscount ? 'Editar Descuento' : 'Crear Nuevo Descuento'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código
                        </label>
                        <input
                            type="text"
                            name="codigo"
                            value={formData.codigo}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese el código de descuento"
                            />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Porcentaje de Descuento
                        </label>
                        <input
                            type="number"
                            name="procentaje"
                            min="0"
                            max="100"
                            value={formData.procentaje}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese el porcentaje"
                            />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Finalización
                        </label>
                        <input
                            type="date"
                            name="fecha_finalizacion"
                            value={formData.fecha_finalizacion}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                            {currentDiscount ? 'Guardar Cambios' : 'Crear Descuento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiscountModal;