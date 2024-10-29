import { Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../BackEnd/Auth/AuthContext';
import './TopGroups.css';

const TopGroups = () => {
    const { isLoggedIn } = useAuth();
    const [toast, setToast] = useState(null);
    const [myGroups, setMyGroups] = useState([]);

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
        },
        {
            id: 3,
            name: "RPG Masters",
            description: "Comunidad dedicada a los amantes de los RPG",
            image: "https://via.placeholder.com/800x600",
            members: 120,
            categories: ["RPG"]
        },
        {
            id: 4,
            name: "Strategy Pros",
            description: "Para los expertos en juegos de estrategia",
            image: "https://via.placeholder.com/800x600",
            members: 75,
            categories: ["Estrategia"]
        }
    ];

    const topGroups = [...groups].sort((a, b) => b.members - a.members).slice(0, 3);

    useEffect(() => {
        const savedGroups = localStorage.getItem('MisGrupos');
        if (savedGroups) {
            setMyGroups(JSON.parse(savedGroups));
        }
    }, []);

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
                            <button
                                className="group-button"
                                onClick={() => handleJoinGroup(group)}
                                disabled={myGroups.includes(group.id)}
                            >
                                {myGroups.includes(group.id) ? 'Ya eres miembro' : 'Unirse al Grupo'}
                            </button>
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