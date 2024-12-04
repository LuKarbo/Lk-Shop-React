import { useState } from 'react';
import { X } from 'lucide-react';

const AddGameModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    discounts = [],
    editors = [],
    categories = []
}) => {
    const [gameData, setGameData] = useState({
        game_name: '',
        game_description: '',
        categorias: [], 
        copias_cantidad: 10000,
        copias_disponibles: 10000,
        editor_id: null, 
        fecha_lanzamiento: '',
        precio_original: '0.00',
        precio_con_descuento: '0.00',
        puntaje: '',
        id_descuento: 0,
        gameBanner: null
    });

    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const activeDiscounts = discounts?.filter(
        discount => discount?.status_nombre === 'Activo'
    ) || [];

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        setImagePreview(url);
        setGameData(prev => ({ ...prev, gameBanner: url }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGameData(prev => {
            const updatedData = { ...prev, [name]: value };
            
            if (name === 'precio_original' && prev.id_descuento !== 0) {
                const selectedDiscount = activeDiscounts.find(
                    d => d.id_discount_code === prev.id_descuento
                );
                
                if (selectedDiscount) {
                    updatedData.precio_con_descuento = (
                        value * (1 - selectedDiscount.procentaje / 100)
                    ).toFixed(2);
                }
            }
            
            return updatedData;
        });
    };

    const handleCopyCountChange = (e) => {
        const { name, value } = e.target;
        setGameData(prev => {
            if (name === 'copias_cantidad') {
                const newTotal = Number(value);
                const newAvailable = Math.min(prev.copias_disponibles, newTotal);
                return { 
                    ...prev, 
                    copias_cantidad: newTotal,
                    copias_disponibles: newAvailable
                };
            } else if (name === 'copias_disponibles') {
                const newAvailable = Math.min(Number(value), prev.copias_cantidad);
                return { 
                    ...prev, 
                    copias_disponibles: newAvailable 
                };
            }
            return prev;
        });
    };

    const handleEditorChange = (e) => {
        setGameData(prev => ({ 
        ...prev, 
        editor_id: Number(e.target.value) 
        }));
    };

    const handleCategoryChange = (e) => {
        const categoryId = Number(e.target.value);
        setGameData(prev => {
        const updatedCategories = prev.categorias.includes(categoryId)
            ? prev.categorias.filter(id => id !== categoryId)
            : [...prev.categorias, categoryId];
        return { ...prev, categorias: updatedCategories };
        });
    };

    const handleDiscountChange = (e) => {
        const selectedDiscount = activeDiscounts.find(
        d => d.id_discount_code === Number(e.target.value)
        );
        
        setGameData(prev => ({
        ...prev, 
        id_descuento: selectedDiscount ? selectedDiscount.id_discount_code : 0,
        precio_con_descuento: selectedDiscount 
            ? (prev.precio_original * (1 - selectedDiscount.procentaje / 100)).toFixed(2) 
            : prev.precio_original
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(gameData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
                <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold mb-6">Añadir Nuevo Juego</h2>
                
                <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex gap-4">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700">Nombre del Juego</label>
                        <input
                        type="text"
                        name="game_name"
                        value={gameData.game_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Puntaje</label>
                        <input
                        type="number"
                        name="puntaje"
                        step="0.1"
                        max="10"
                        value={gameData.puntaje}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        required
                        />
                    </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            name="game_description"
                            value={gameData.game_description}
                            onChange={handleInputChange}
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha de Lanzamiento
                        </label>
                        <input
                            type="date"
                            name="fecha_lanzamiento"
                            value={gameData.fecha_lanzamiento}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Copias Totales</label>
                        <input
                            type="number"
                            name="copias_cantidad"
                            min="0"
                            value={gameData.copias_cantidad}
                            onChange={handleCopyCountChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Copias Disponibles</label>
                        <input
                            type="number"
                            name="copias_disponibles"
                            min="0"
                            max={gameData.copias_cantidad}
                            value={gameData.copias_disponibles}
                            onChange={handleCopyCountChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Editorial</label>
                        <select
                            onChange={handleEditorChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            value={gameData.editor_id || ''}
                            required
                        >
                            <option value="">Seleccionar Editorial</option>
                            {editors.map(editor => (
                            <option 
                                key={editor.id_editor} 
                                value={editor.id_editor}
                            >
                                {editor.nombre}
                            </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categorías</label>
                        <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                            {categories.map(category => (
                            <div key={category.id_category} className="flex items-center">
                                <input
                                type="checkbox"
                                id={`category-${category.id_category}`}
                                value={category.id_category}
                                checked={gameData.categorias.includes(category.id_category)}
                                onChange={handleCategoryChange}
                                className="mr-2"
                                />
                                <label htmlFor={`category-${category.id_category}`}>{category.nombre}</label>
                            </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL del Banner del Juego</label>
                        <div className="flex items-center">
                            <input
                            type="text"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                            placeholder="Ingrese la URL de la imagen"
                            className="flex-grow mr-4 px-4 py-2 border border-gray-300 rounded-md"
                            />
                            {imagePreview && (
                            <div className="ml-4 relative">
                                <img 
                                src={imagePreview} 
                                alt="Banner preview" 
                                className="h-20 w-40 object-cover rounded"
                                />
                            </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio Original</label>
                        <input
                            type="number"
                            name="precio_original"
                            step="0.01"
                            value={gameData.precio_original}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descuento</label>
                        <select
                            onChange={handleDiscountChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            value={gameData.id_descuento}
                        >
                            <option value="0">Sin Descuento</option>
                            {activeDiscounts.map(discount => (
                            <option 
                                key={discount.id_discount_code} 
                                value={discount.id_discount_code}
                            >
                                {discount.codigo} - {discount.procentaje}%
                            </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio con Descuento</label>
                        <input
                            type="text"
                            value={gameData.precio_con_descuento}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100"
                        />
                    </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                    Cancelar
                    </button>
                    <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                    Guardar Juego
                    </button>
                </div>
                </div>
                </form>
            </div>
        </div>
    );
};

export default AddGameModal;