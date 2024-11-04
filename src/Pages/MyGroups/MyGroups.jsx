import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { groups } from '../../BackEnd/Data/groups';
import "./MyGroups.css";

const MyGroups = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [myGroupIds, setMyGroupIds] = useState([]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [conversations, setConversations] = useState({
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
    });

    // Cargar grupos del usuario y conversaciones desde localStorage
    useEffect(() => {
        if (isLoggedIn) {
            const savedGroups = localStorage.getItem('MisGrupos');
            if (savedGroups) {
                const groupIds = JSON.parse(savedGroups);
                setMyGroupIds(groupIds);
            }

            const savedConversations = localStorage.getItem('GroupConversations');
            if (savedConversations) {
                setConversations(JSON.parse(savedConversations));
            }
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // Guardar conversaciones en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('GroupConversations', JSON.stringify(conversations));
    }, [conversations]);

    const loadMessages = (groupId) => {
        const savedConversations = localStorage.getItem('GroupConversations');
        if (savedConversations) {
            const parsedConversations = JSON.parse(savedConversations);
            return parsedConversations[groupId] || [];
        }
        return conversations[groupId] || [];
    };

    useEffect(() => {
        if (!activeGroup) return;

        const intervalId = setInterval(() => {
            const updatedMessages = loadMessages(activeGroup);
            // Solo actualizar si hay nuevos mensajes
            if (JSON.stringify(updatedMessages) !== JSON.stringify(messages)) {
                setMessages(updatedMessages);
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, [activeGroup, messages]);

    // Filtrar solo los grupos a los que pertenece el usuario
    const myGroups = groups.filter(group => myGroupIds.includes(group.id));

    const handleGroupClick = (groupId) => {
        setActiveGroup(groupId);
        const groupMessages = loadMessages(groupId);
        setMessages(groupMessages);
    };

    const handleSendMessage = () => {
        if (inputMessage.trim() && activeGroup) {
            const currentTime = new Date().toLocaleString();
            const newMessage = {
                id: messages.length + 1,
                text: inputMessage,
                user: "my",
                name: "Yo",
                timestamp: currentTime,
            };

            // Actualizar tanto el estado local como las conversaciones persistentes
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            setConversations(prevConversations => ({
                ...prevConversations,
                [activeGroup]: updatedMessages
            }));
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