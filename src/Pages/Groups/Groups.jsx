import { useState, useEffect } from 'react';
import { Search, X, Image as ImageIcon, ChevronDown, Link2 } from 'lucide-react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { groups } from '../../BackEnd/Data/groups';
import GroupCard from './GroupCard';
import './Groups.css';

const Groups = () => {
    const { isLoggedIn } = useAuth();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [selectedGroupToLeave, setSelectedGroupToLeave] = useState(null);
    const [toast, setToast] = useState(null);
    const [myGroups, setMyGroups] = useState(() => {
        const storedGroups = localStorage.getItem('MisGrupos');
        return storedGroups ? JSON.parse(storedGroups) : [];
    });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
        imageUrl: '',
        imagePreview: null,
        categories: []
    });
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [imageUrlError, setImageUrlError] = useState('');

    const categories = [
        "Acción", "Aventura", "RPG", "Estrategia", "Deportes",
        "Carreras", "Shooter", "Puzzle", "Arcade", "Simulación"
    ];

    const toggleCategoryFilter = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    useEffect(() => {
        const filtered = groups.filter(group => {
            const matchesSearch = 
                group.name.toLowerCase().includes(search.toLowerCase()) ||
                group.description.toLowerCase().includes(search.toLowerCase()) ||
                group.categories.some(category => 
                    category.toLowerCase().includes(search.toLowerCase())
                );
            
            const matchesCategories = 
                selectedCategories.length === 0 || 
                group.categories.some(category => selectedCategories.includes(category));

            return matchesSearch && matchesCategories;
        });
        setFilteredGroups(filtered);
    }, [search, selectedCategories]);

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

    const handleCreateGroup = () => {
        if (imageUrlError) {
            showToast('Por favor, corrija la URL de la imagen');
            return;
        }

        const newGroupData = {
            ...newGroup,
            id: groups.length + 1,
            members: 1,
        };
        console.log('Nuevo grupo creado:', newGroupData);
        showToast(`Grupo ${newGroup.name} creado exitosamente`);
        setShowModal(false);
        setNewGroup({
            name: '',
            description: '',
            imageUrl: '',
            imagePreview: null,
            categories: []
        });
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleJoinGroup = (group) => {
        if (!isLoggedIn) {
            showToast('Debe estar logeado para unirse');
            return;
        }

        const updatedMyGroups = [...myGroups, group.id];
        localStorage.setItem('MisGrupos', JSON.stringify(updatedMyGroups));
        setMyGroups(updatedMyGroups);
        showToast(`Te has unido al grupo ${group.name}`);
    };

    const handleLeaveGroup = (group) => {
        setSelectedGroupToLeave(group);
        setShowLeaveModal(true);
    };

    const confirmLeaveGroup = () => {
        const updatedMyGroups = myGroups.filter(id => id !== selectedGroupToLeave.id);
        localStorage.setItem('MisGrupos', JSON.stringify(updatedMyGroups));
        setMyGroups(updatedMyGroups);
        showToast(`Has dejado el grupo ${selectedGroupToLeave.name}`);
        setShowLeaveModal(false);
        setSelectedGroupToLeave(null);
    };

    const toggleCategory = (category) => {
        setNewGroup(prev => {
            const categories = prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category];
            return { ...prev, categories };
        });
    };

    const removeCategory = (categoryToRemove) => {
        setNewGroup(prev => ({
            ...prev,
            categories: prev.categories.filter(category => category !== categoryToRemove)
        }));
    };

    useEffect(() => {
        const filtered = groups.filter(group =>
            group.name.toLowerCase().includes(search.toLowerCase()) ||
            group.description.toLowerCase().includes(search.toLowerCase()) ||
            group.categories.some(category => 
                category.toLowerCase().includes(search.toLowerCase())
            )
        );
        setFilteredGroups(filtered);
    }, [search]);

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
                                        key={category}
                                        className={`category-filter-option ${
                                            selectedCategories.includes(category) ? 'selected' : ''
                                        }`}
                                        onClick={() => toggleCategoryFilter(category)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            readOnly
                                        />
                                        {category}
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
                        key={group.id}
                        group={group}
                        isLoggedIn={isLoggedIn}
                        isMember={myGroups.includes(group.id)}
                        onJoin={handleJoinGroup}
                        onLeave={handleLeaveGroup}
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
                                        {categories.filter(category => !newGroup.categories.includes(category)).map((category) => (
                                            <div
                                                key={category}
                                                className="category-option"
                                                onClick={() => toggleCategory(category)}
                                            >
                                                {category}
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

            {toast && (
                <div className={`contact-toast ${toast ? 'contact-toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Groups;