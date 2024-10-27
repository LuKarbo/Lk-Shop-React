import { Users } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../BackEnd/Auth/AuthContext';
import './TopGroups.css';

const TopGroups = () => {
    const { isLoggedIn } = useAuth();
    const [toast, setToast] = useState(null);

    const topGroups = [
        {
            id: 1,
            name: "Gaming Masters",
            description: "Comunidad de jugadores expertos",
            members: 15000,
            image: "https://via.placeholder.com/400x400"
        },
        {
            id: 2,
            name: "Pro Gamers",
            description: "Para gamers competitivos",
            members: 12000,
            image: "https://via.placeholder.com/400x400"
        },
        {
            id: 3,
            name: "Casual Players",
            description: "Diversión sin presiones",
            members: 10000,
            image: "https://via.placeholder.com/400x400"
        }
    ];

    const handleJoinGroup = (group) => {
        console.log('Unido al grupo:', group.name);
        showToast(`Te has unido al grupo ${group.name}`);
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="top-groups-container">
            <div className="section-header">
                <h2 className="group-title">Grupos Más Populares</h2>
            </div>
            
            <div className="top-groups-grid">
                {topGroups.map(group => (
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
                                    <Users size={14} />
                                    {group.members.toLocaleString()}
                                </span>
                            </div>
                            <p className="group-description">{group.description}</p>
                            {isLoggedIn? (
                                <button
                                    className="group-button"
                                    onClick={() => handleJoinGroup(group)}
                                >
                                    Unirse al Grupo
                                </button>
                            ):(
                                <button
                                    className="group-button"
                                    onClick={() => showToast('Debe de estar Logeado para unirse')}
                                >
                                    Unirse al Grupo
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {toast && (
                <div className={`contact-toast ${toast ? 'contact-toast-show' : ''}`}>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default TopGroups;