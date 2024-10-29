import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import "./MyGroups.css";

const MyGroups = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [myGroupIds, setMyGroupIds] = useState([]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    // Lista compartida de grupos
    const allGroups = [
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

    // Conversaciones simuladas por grupo
    const conversations = {
        1: [
            { id: 1, text: "¡Bienvenidos al grupo de Gamers Elite!", user: "other", name: "Admin", timestamp: "2023-04-01 10:30" },
            { id: 2, text: "¿Alguien para una partida competitiva?", user: "other", name: "Juan", timestamp: "2023-04-01 10:32" },
        ],
        2: [
            { id: 1, text: "¡Hola a todos los jugadores casuales!", user: "other", name: "María", timestamp: "2023-04-02 15:20" },
            { id: 2, text: "¿Qué juegos recomiendan para relajarse?", user: "other", name: "Luis", timestamp: "2023-04-02 15:22" },
        ],
        3: [
            { id: 1, text: "¿Alguien jugando el último Final Fantasy?", user: "other", name: "Ana", timestamp: "2023-04-03 09:00" },
            { id: 2, text: "¡Aquí fan de los RPG clásicos!", user: "other", name: "Carlos", timestamp: "2023-04-03 10:10" },
        ],
        4: [
            { id: 1, text: "Bienvenidos estrategas", user: "other", name: "Admin", timestamp: "2023-04-03 09:00" },
            { id: 2, text: "¿Civilization o Age of Empires?", user: "other", name: "Elena", timestamp: "2023-04-03 10:10" },
        ],
    };

    // Cargar grupos del usuario desde localStorage
    useEffect(() => {
        if (isLoggedIn) {
            const savedGroups = localStorage.getItem('MisGrupos');
            if (savedGroups) {
                const groupIds = JSON.parse(savedGroups);
                setMyGroupIds(groupIds);
            }
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // Filtrar solo los grupos a los que pertenece el usuario
    const myGroups = allGroups.filter(group => myGroupIds.includes(group.id));

    const loadMessages = (groupId) => {
        return conversations[groupId] || [];
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (activeGroup) {
                const messages = loadMessages(activeGroup);
                setMessages(messages);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [activeGroup]);

    const handleGroupClick = (groupId) => {
        setActiveGroup(groupId);
        const messages = loadMessages(groupId);
        setMessages(messages);
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const currentTime = new Date().toLocaleString();
            const newMessage = {
                id: messages.length + 1,
                text: inputMessage,
                user: "my",
                name: "Yo",
                timestamp: currentTime,
            };

            setMessages([...messages, newMessage]);
            setInputMessage("");
        }
    };

    return (
        <div className="chat-view">
            <div className="group-list">
                <h3 className="text-xl font-bold mb-4">Mis Grupos</h3>
                <ul>
                    {myGroups.map((group) => (
                        <li
                            key={group.id}
                            onClick={() => handleGroupClick(group.id)}
                            className={`flex items-center p-2 hover:bg-gray-200 cursor-pointer ${
                                activeGroup === group.id ? 'bg-gray-200' : ''
                            }`}
                        >
                            <div
                                className="group-icon mr-2"
                                style={{ backgroundImage: `url(${group.image})` }}
                            ></div>
                            <div className="flex flex-col">
                                <span className="font-medium">{group.name}</span>
                                <span className="text-sm text-gray-500">{group.members} miembros</span>
                            </div>
                        </li>
                    ))}
                    <li 
                        onClick={() => navigate("/groups")} 
                        className="flex items-center p-2 hover:bg-gray-200 cursor-pointer text-blue-500"
                    >
                        + Unirse a más grupos
                    </li>
                </ul>
            </div>
            <div className="chat-area">
                {activeGroup ? (
                    <>
                        <div className="chat-header">
                            <h3 className="text-xl font-bold mb-4">
                                {myGroups.find((group) => group.id === activeGroup)?.name}
                            </h3>
                            <div className="text-sm text-gray-500 mb-4">
                                {myGroups.find((group) => group.id === activeGroup)?.description}
                            </div>
                        </div>
                        <div className="messages">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.user} flex flex-col p-3 rounded-lg mb-2`}
                                >
                                    <div className="message-user font-medium">{message.name}</div>
                                    <div className="message-text">{message.text}</div>
                                    <div className="message-timestamp text-gray-500 text-sm">
                                        {message.timestamp}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="input-area flex items-center">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 px-4 py-2 bg-white rounded-lg shadow-md mr-4"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="send-button px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                            >
                                Enviar
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                        <p className="mb-4">Selecciona un grupo para ver el chat</p>
                        {myGroups.length === 0 && (
                            <button
                                onClick={() => navigate("/groups")}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                            >
                                Explorar Grupos
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyGroups;