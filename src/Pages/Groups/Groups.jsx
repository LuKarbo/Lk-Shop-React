import { useState } from 'react';
import { Users, Image as ImageIcon } from 'lucide-react';
import Modal from './Modal/Modal';
import './Groups.css';

const Groups = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
        image: null,
        imagePreview: null
    });

    const groups = [
        {
            id: 1,
            name: "Gamers Elite",
            description: "Grupo dedicado a jugadores competitivos de diversos géneros",
            image: "https://via.placeholder.com/600x400",
            members: 156
        },
        {
            id: 2,
            name: "Casual Gaming",
            description: "Para jugadores que disfrutan de sesiones relajadas y amistosas",
            image: "https://via.placeholder.com/600x400",
            members: 89
        }
    ];

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

    const handleCreateGroup = () => {
        console.log('Grupo Creado:', newGroup);
        setIsModalOpen(false);
        setNewGroup({ name: '', description: '', image: null, imagePreview: null });
    };

    const handleJoinGroup = (id, nombre) => {
        console.log('Te uniste al grupo:', nombre);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewGroup({ name: '', description: '', image: null, imagePreview: null });
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="groups-container">
            <div className="container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar grupos..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button 
                        className="create-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Crear Grupo
                    </button>
                </div>

                <div className="groups-grid">
                    {filteredGroups.map((group) => (
                        <div key={group.id} className="group-card">
                            <img
                                src={group.image}
                                alt={group.name}
                                className="group-image"
                            />
                            <div className="card-content">
                                <div className="card-header">
                                    <h3 className="group-title">{group.name}</h3>
                                    <div className="members-count">
                                        <Users size={16} className="members-icon" />
                                        <span>{group.members}</span>
                                    </div>
                                </div>
                                <p className="group-description">{group.description}</p>
                                <button className="join-button" onClick={() => handleJoinGroup(group.id, group.name)}>
                                    Unirse al Grupo
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal 
                    isOpen={isModalOpen} 
                    onClose={handleModalClose}
                    title="Crear Nuevo Grupo"
                >
                    <div className="modal-content">
                        <div className="form-group">
                            <label>Nombre del Grupo</label>
                            <input
                                type="text"
                                className="form-input"
                                value={newGroup.name}
                                onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Imagen del Grupo</label>
                            <div className="image-upload">
                                {newGroup.imagePreview ? (
                                    <div className="image-preview-container">
                                        <img 
                                            src={newGroup.imagePreview} 
                                            alt="Preview" 
                                            className="image-preview"
                                        />
                                        <button 
                                            className="change-image-button"
                                            onClick={() => setNewGroup({...newGroup, image: null, imagePreview: null})}
                                        >
                                            Cambiar imagen
                                        </button>
                                    </div>
                                ) : (
                                    <label className="upload-area">
                                        <ImageIcon className="upload-icon" />
                                        <p>Haz click o arrastra una imagen</p>
                                        <input 
                                            type="file" 
                                            className="hidden"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                className="form-textarea"
                                rows={4}
                                value={newGroup.description}
                                onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={handleModalClose}>
                                Cancelar
                            </button>
                            <button className="submit-button" onClick={handleCreateGroup}>
                                Crear Grupo
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Groups;