import { useState, useEffect } from 'react';
import { Search, X, Image as ImageIcon, ChevronDown, Link2 } from 'lucide-react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { GroupsApi } from '../../BackEnd/API/GroupsAPI';
import { GamesAPI } from '../../BackEnd/API/GamesAPI';
import GroupCard from './GroupCard';
import './Groups.css';

const Groups = () => {
    const { isLoggedIn } = useAuth();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [selectedGroupToLeave, setSelectedGroupToLeave] = useState(null);
    const [toast, setToast] = useState(null);
    const [myGroups, setMyGroups] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);
    const [categories, setCategories] = useState([]);
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
        imageUrl: '',
        imagePreview: null,
        categories: [],
        categoryIds: []
    });
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [imageUrlError, setImageUrlError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGroupToDelete, setSelectedGroupToDelete] = useState(null);
    const userId = localStorage.getItem('user');
    const accessToken = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allGroupsResponse, categoriesResponse] = await Promise.all([
                    GroupsApi.getAllGroups(),
                    GamesAPI.getCategories()
                ]);

                if (allGroupsResponse.success) {
                    const groupsWithOwnership = allGroupsResponse.data.map(group => ({
                        ...group,
                        isOwner: group.owner_id == userId
                    }));
                    setGroups(groupsWithOwnership);
                }
                
                setCategories(categoriesResponse.data || []);

                if (isLoggedIn) {
                    const userGroupsResponse = await GroupsApi.getUserGroups(userId);
                    if (userGroupsResponse.success) {
                        const userGroupIds = userGroupsResponse.data.map(group => group.id_group);
                        setMyGroups(userGroupIds);
                    }
                }
            } catch (error) {
                showToast('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoggedIn]);

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setNewGroup({ ...newGroup, imageUrl: url });
        setImageUrlError('');

        if (url) {
            const img = new Image();
            img.onload = () => {
                setNewGroup(prev => ({
                    ...prev,
                    imagePreview: url
                }));
                setImageUrlError('');
            };
            img.onerror = () => {
                setImageUrlError('URL de imagen inválida');
                setNewGroup(prev => ({
                    ...prev,
                    imagePreview: null
                }));
            };
            img.src = url;
        } else {
            setNewGroup(prev => ({
                ...prev,
                imagePreview: null
            }));
        }
    };

    const handleCreateGroup = async () => {
        if (imageUrlError) {
            showToast('Por favor, corrija la URL de la imagen');
            return;
        }
    
        
        const categoryIdsString = newGroup.categoryIds.join(',');
    
        try {
            const response = await GroupsApi.createGroup(
                newGroup.name,
                newGroup.description,
                newGroup.imageUrl,
                userId,
                accessToken,
                categoryIdsString
            );
    
            if (response.success) {
                showToast(`Grupo ${newGroup.name} creado exitosamente`);
                setShowModal(false);
                setNewGroup({
                    name: '',
                    description: '',
                    imageUrl: '',
                    imagePreview: null,
                    categories: [],
                    categoryIds: []
                });
                
                const allGroupsResponse = await GroupsApi.getAllGroups();
                if (allGroupsResponse.success) {
                    setGroups(allGroupsResponse.data);
                }
            } else {
                showToast(response.message || 'Error al crear el grupo');
            }
        } catch (error) {
            showToast('Error al crear el grupo');
        }
    };

    const handleJoinGroup = async (group) => {
        if (!isLoggedIn) {
            showToast('Debe estar logeado para unirse');
            return;
        }

        try {
            const response = await GroupsApi.joinGroup(group.id, userId);
            if (response.success) {
                const updatedMyGroups = [...myGroups, group.id];
                setMyGroups(updatedMyGroups);
                showToast(`Te has unido al grupo ${group.name}`);
            } else {
                showToast(response.message || 'Error al unirse al grupo');
            }
        } catch (error) {
            showToast('Error al unirse al grupo');
        }
    };

    const handleLeaveGroup = (group) => {
        setSelectedGroupToLeave(group);
        setShowLeaveModal(true);
    };

    const confirmLeaveGroup = async () => {
        try {
            const response = await GroupsApi.leaveGroup(selectedGroupToLeave.id, userId);
            if (response.success) {
                const updatedMyGroups = myGroups.filter(id => id !== selectedGroupToLeave.id);
                setMyGroups(updatedMyGroups);
                showToast(`Has dejado el grupo ${selectedGroupToLeave.name}`);
            } else {
                showToast(response.message || 'Error al salir del grupo');
            }
        } catch (error) {
            showToast('Error al salir del grupo');
        }
        setShowLeaveModal(false);
        setSelectedGroupToLeave(null);
    };

    const toggleCategoryFilter = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const toggleCategory = (category, categoryId) => {
        
        setNewGroup(prev => {
            const categories = prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category];
            const categoryIds = prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId];
            return { ...prev, categories, categoryIds };
        });
    };

    const removeCategory = (categoryToRemove) => {
        
        setNewGroup(prev => {
            const categoryIndex = prev.categories.indexOf(categoryToRemove);
            const newCategories = prev.categories.filter(category => category !== categoryToRemove);
            const newCategoryIds = prev.categoryIds.filter((_, index) => index !== categoryIndex);
            return {
                ...prev,
                categories: newCategories,
                categoryIds: newCategoryIds
            };
        });
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) {
        return <div>Cargando grupos...</div>;
    }

    const filteredGroups = groups.filter(group => {
        const matchesSearch = 
            group.group_name.toLowerCase().includes(search.toLowerCase()) ||
            (group.group_description || '').toLowerCase().includes(search.toLowerCase()) ||
            (group.categories || '').toLowerCase().includes(search.toLowerCase());
        
        const matchesCategories = 
            selectedCategories.length === 0 || 
            (group.categories || '').split(',').some(category => 
                selectedCategories.includes(category.trim())
            );

        return matchesSearch && matchesCategories;
    });

    const handleDeleteGroup = (group) => {
        setSelectedGroupToDelete(group);
        setShowDeleteModal(true);
    };

    const confirmDeleteGroup = async () => {
        try {
            const response = await GroupsApi.deleteGroup(selectedGroupToDelete.id, accessToken);
            if (response.success) {
                const updatedGroups = groups.filter(g => g.id_group !== selectedGroupToDelete.id);
                setGroups(updatedGroups);
                
                const updatedMyGroups = myGroups.filter(id => id !== selectedGroupToDelete.id);
                setMyGroups(updatedMyGroups);
                
                showToast(`Grupo ${selectedGroupToDelete.name} eliminado exitosamente`);
            } else {
                showToast(response.message || 'Error al eliminar el grupo');
            }
        } catch (error) {
            showToast('Error al eliminar el grupo');
        }
        setShowDeleteModal(false);
        setSelectedGroupToDelete(null);
    };

    return (
        <div className="groups-container">
            <div className="row">
            <div className="groups-search-container col-lg-8">
                    <Search className="groups-search-icon" size={25} />
                    <input
                        type="text"
                        placeholder="Buscar grupos por nombre, descripción o categoría..."
                        className="groups-search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="col-lg-2">
                    <div className="category-filter-container">
                        <button 
                            className="category-filter-button"
                            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                        >
                            Categorías ({selectedCategories.length})
                            <ChevronDown size={20} />
                        </button>
                        {showCategoryFilter && (
                            <div className="category-filter-dropdown">
                                {categories.map((category) => (
                                    <div
                                        key={category.id_category}
                                        className={`category-filter-option ${
                                            selectedCategories.includes(category.nombre) ? 'selected' : ''
                                        }`}
                                        onClick={() => toggleCategoryFilter(category.nombre)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.nombre)}
                                            readOnly
                                        />
                                        {category.nombre}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-lg-2">
                    {isLoggedIn && (
                        <button
                            className="group-button"
                            style={{ marginBottom: '32px', maxWidth: '200px' }}
                            onClick={() => setShowModal(true)}
                        >
                            Crear Grupo
                        </button>
                    )}
                </div>
            </div>

            {selectedCategories.length > 0 && (
                <div className="selected-categories">
                    {selectedCategories.map((category) => (
                        <span key={category} className="category-tag">
                            {category}
                            <button onClick={() => toggleCategoryFilter(category)}>
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    <button 
                        className="clear-categories"
                        onClick={() => setSelectedCategories([])}
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            <div className="groups-grid">
                {filteredGroups.map((group) => (
                    <GroupCard
                        key={group.id_group}
                        group={{
                            id: group.id_group,
                            name: group.group_name,
                            description: group.group_description || 'Grupo sin descripción',
                            image: group.groupbanner || "https://via.placeholder.com/800x600",
                            members: group.member_count || 0,
                            categories: group.categories ? group.categories.split(',') : []
                        }}
                        isLoggedIn={isLoggedIn}
                        isMember={myGroups.includes(group.id_group)}
                        isOwner={group.isOwner}
                        onJoin={handleJoinGroup}
                        onLeave={handleLeaveGroup}
                        onDelete={handleDeleteGroup}
                        size="default"
                    />
                ))}
            </div>

            {/* Modal para crear grupo */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">Crear Nuevo Grupo</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Nombre del Grupo</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    placeholder="Ingresa el nombre del grupo"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Imagen del Grupo</label>
                                <div className="image-upload-container">
                                    <div className="image-url-input-container">
                                        <Link2 size={20} className="url-input-icon" />
                                        <input
                                            type="text"
                                            className="form-input image-url-input"
                                            value={newGroup.imageUrl}
                                            onChange={handleImageUrlChange}
                                            placeholder="Ingresa la URL de la imagen"
                                        />
                                    </div>
                                    
                                    {imageUrlError && (
                                        <div className="image-url-error">{imageUrlError}</div>
                                    )}

                                    {newGroup.imagePreview ? (
                                        <div className="image-preview-container">
                                            <img
                                                src={newGroup.imagePreview}
                                                alt="Preview"
                                                className="image-preview"
                                            />
                                            <button 
                                                className="remove-image-btn"
                                                onClick={() => setNewGroup(prev => ({
                                                    ...prev, 
                                                    imageUrl: '', 
                                                    imagePreview: null
                                                }))}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <ImageIcon size={48} />
                                            <span>Ingresa una URL de imagen</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className="form-textarea"
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                    placeholder="Describe tu grupo"
                                    rows={4}
                                />
                            </div>

                            <div className="form-group">
                            <label className="form-label">Categorías</label>
                            <div
                                className="categories-select"
                                onClick={() => setShowCategoryOptions(!showCategoryOptions)}
                            >
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {newGroup.categories.map((category) => (
                                        <span key={category} className="category-tag">
                                            {category}
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                removeCategory(category);
                                            }}>
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {showCategoryOptions && (
                                <div className="category-options">
                                    {categories
                                        .filter(category => !newGroup.categories.includes(category.nombre))
                                        .map((category) => (
                                            <div
                                                key={category.id_category}
                                                className="category-option"
                                                onClick={() => toggleCategory(category.nombre, category.id_category)}
                                            >
                                                {category.nombre}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="group-button"
                                style={{ backgroundColor: '#666', maxWidth: '120px' }}
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="group-button"
                                style={{ maxWidth: '100px' }}
                                onClick={handleCreateGroup}
                            >
                                Crear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para confirmar salida del grupo */}
            {showLeaveModal && selectedGroupToLeave && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Confirmar Salida</h2>
                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowLeaveModal(false);
                                    setSelectedGroupToLeave(null);
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro que deseas salir del grupo "{selectedGroupToLeave.name}"?</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="group-button"
                                style={{ backgroundColor: '#666', maxWidth: '120px' }}
                                onClick={() => {
                                    setShowLeaveModal(false);
                                    setSelectedGroupToLeave(null);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="group-button"
                                style={{ backgroundColor: '#dc3545', maxWidth: '120px' }}
                                onClick={confirmLeaveGroup}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para confirmar eliminación de grupo */}
            {showDeleteModal && selectedGroupToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Confirmar Eliminación</h2>
                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedGroupToDelete(null);
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro que deseas eliminar el grupo "{selectedGroupToDelete.name}"? Esta acción no se puede deshacer.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="group-button"
                                style={{ backgroundColor: '#666', maxWidth: '120px' }}
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedGroupToDelete(null);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="group-button"
                                style={{ backgroundColor: '#dc3545', maxWidth: '120px' }}
                                onClick={confirmDeleteGroup}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`contact-toast ${toast ? 'contact-toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Groups;