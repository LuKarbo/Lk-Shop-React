import { useState, useEffect } from 'react';

const EditGroupModal = ({ isOpen, onClose, group, categories, onSubmit }) => {
    const [editForm, setEditForm] = useState({
        id: '',
        name: '',
        description: '',
        categories: []
    });

    useEffect(() => {
        if (group && categories) {
            const mappedCategories = group.categories
                ?.split(', ')
                .map(catName => {
                    const category = categories.find(c => c.nombre === catName);
                    return category ? category.id_category : null;
                })
                .filter(Boolean);
    
            setEditForm({
                id: group.id_group || '',
                name: group.group_name || '',
                description: group.group_description || '',
                categories: mappedCategories
            });
        }
    }, [group, categories]);
    

    const toggleCategory = (categoryId) => {
        setEditForm((prev) => ({
            ...prev,
            categories: Array.isArray(prev.categories)
                ? prev.categories.includes(categoryId)
                    ? prev.categories.filter((cat) => cat !== categoryId)
                    : [...prev.categories, categoryId]
                : [categoryId],
        }));
    };
    

    const isCategorySelected = (categoryName) => {
        if (!categories || !editForm.categories) return false;
    
        const category = categories.find(cat => cat.nombre === categoryName);
        return category ? editForm.categories.includes(category.id_category) : false;
    };
    

    if (!isOpen || !group) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
                <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-lg font-semibold">Editar Grupo</h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categorías
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <button
                                            key={category.id_category}
                                            onClick={() => toggleCategory(category.id_category)}
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                isCategorySelected(category.nombre)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {category.nombre}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 p-4 border-t">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => onSubmit(editForm)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditGroupModal;
