import { useState, useEffect } from 'react';
import { Search, Users, X, Image as ImageIcon } from 'lucide-react';
import './Groups.css';

const Groups = () => {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
        image: null,
        imagePreview: null,
        categories: []
    });
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);

    const categories = [
        "Acción", "Aventura", "RPG", "Estrategia", "Deportes",
        "Carreras", "Shooter", "Puzzle", "Arcade", "Simulación"
    ];

    const groups = [
        {
            id: 1,
            name: "Gamers Elite",
            description: "Grupo dedicado a jugadores competitivos de diversos géneros",
            image: "https://via.placeholder.com/800x600",
            members: 156,
            categories: ["Acción", "Shooter"]
        },
        {
            id: 2,
            name: "Casual Gaming",
            description: "Para jugadores que disfrutan de sesiones relajadas y amistosas",
            image: "https://via.placeholder.com/800x600",
            members: 89,
            categories: ["Aventura", "Puzzle"]
        }
    ];

    useEffect(() => {
        setFilteredGroups(groups);
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewGroup({
                    ...newGroup,
                    image: file,
                    imagePreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleCreateGroup = () => {
        console.log('Nuevo grupo creado:', newGroup);
        showToast(`Grupo ${newGroup.name} creado exitosamente`);
        setShowModal(false);
        setNewGroup({
            name: '',
            description: '',
            image: null,
            imagePreview: null,
            categories: []
        });
    };

    const handleJoinGroup = (group) => {
        console.log('Unido al grupo:', group.name);
        showToast(`Te has unido al grupo ${group.name}`);
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
            group.description.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredGroups(filtered);
    }, [search]);

    return (
        <div className="groups-container">
            <div className="row">
                <div className="groups-search-container col-lg-10">
                    <Search className="groups-search-icon" size={25} />
                    <input
                        type="text"
                        placeholder="Buscar grupos..."
                        className="groups-search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="col-lg-2">
                    <button
                        className="group-button"
                        style={{ marginBottom: '32px', maxWidth: '200px' }}
                        onClick={() => setShowModal(true)}
                    >
                        Crear Grupo
                    </button>
                </div>
            </div>


            <div className="groups-grid">
                {filteredGroups.map((group) => (
                    <div key={group.id} className="group-card">
                        <div className="group-image-container">
                            <img
                                src={group.image}
                                alt={group.name}
                                className="group-image"
                            />
                        </div>
                        <div className="group-content">
                            <div className="group-header">
                                <h3 className="group-title">{group.name}</h3>
                                <span className="group-members">
                                    <Users size={16} />
                                    {group.members}
                                </span>
                            </div>
                            <p className="group-description">{group.description}</p>
                            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {group.categories.map((category) => (
                                    <span key={category} className="category-tag">
                                        {category}
                                    </span>
                                ))}
                            </div>
                            <button
                                className="group-button"
                                onClick={() => handleJoinGroup(group)}
                            >
                                Unirse al Grupo
                            </button>
                        </div>
                    </div>
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
                                <div
                                    className="image-upload-container"
                                    onClick={() => document.getElementById('imageInput').click()}
                                >
                                    {newGroup.imagePreview ? (
                                        <img
                                            src={newGroup.imagePreview}
                                            alt="Preview"
                                            className="image-preview"
                                        />
                                    ) : (
                                        <div style={{ color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <ImageIcon size={48} />
                                            <span>Click para subir imagen</span>
                                        </div>
                                    )}
                                    <input
                                        id="imageInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
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

            {toast && (
                <div className={`toast ${toast ? 'toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Groups;