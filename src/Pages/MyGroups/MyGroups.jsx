import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./MyGroups.css";

const MyGroups = () => {
    const [groups, setGroups] = useState([
        { id: 1, name: "Grupo 1", icon: "https://placehold.co/400x400", lastViewed: "2023-04-01 10:30" },
        { id: 2, name: "Grupo 2", icon: "https://placehold.co/400x400", lastViewed: "2023-04-01 10:30" },
        { id: 3, name: "Grupo 3", icon: "https://placehold.co/400x400", lastViewed: "2023-04-01 10:30" },
    ]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const navigate = useNavigate();

    // Busco y cargo los mensajes
    const loadMessages = (groupId) => {
        const conversations = {
            1: [
                { id: 1, text: "Hola a todos!", user: "other", name: "Juan", timestamp: "2023-04-01 10:30" },
                { id: 2, text: "¿Cómo están?", user: "my", name: "Yo", timestamp: "2023-04-01 10:32" },
                { id: 3, text: "¡Buenas noticias!", user: "other", name: "María", timestamp: "2023-04-02 11:15" },
            ],
            2: [
                { id: 1, text: "¡Hola, grupo 2!", user: "other", name: "María", timestamp: "2023-04-02 15:20" },
                { id: 2, text: "Genial!", user: "other", name: "Luis", timestamp: "2023-04-02 15:22" },
                { id: 3, text: "Tengo una pregunta", user: "my", name: "Yo", timestamp: "2023-04-03 09:45" },
            ],
            3: [
                { id: 1, text: "Buenos días!", user: "other", name: "Ana", timestamp: "2023-04-03 09:00" },
                { id: 2, text: "¿Alguien disponible?", user: "other", name: "Carlos", timestamp: "2023-04-03 10:10" },
            ],
        };



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
    }, [activeGroup, groups]);

    const handleGroupClick = (groupId) => {
        setActiveGroup(groupId);
        const messages = loadMessages(groupId);
        setMessages(messages)

        const updatedGroups = groups.map((group) =>
            group.id === groupId ? { ...group, lastViewed: new Date().toLocaleString() } : group
        );
        setGroups(updatedGroups);
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
                <h3 className="text-xl font-bold mb-4">Grupos</h3>
                <ul>
                    {groups.map((group) => (
                        <li
                            key={group.id}
                            onClick={() => handleGroupClick(group.id)}
                            className={`flex items-center p-2 hover:bg-gray-200 cursor-pointer`}
                        >
                            <div
                                className="group-icon mr-2"
                                style={{ backgroundImage: `url(${group.icon})` }}
                            ></div>
                            <span>{group.name}</span>
                        </li>
                    ))}
                        <li onClick={() => navigate("/groups")} className={`flex items-center p-2 hover:bg-gray-200 cursor-pointer`}>
                            <span>Unete a un Grupo!</span>
                        </li>
                </ul>
            </div>
            <div className="chat-area">
                {activeGroup ? (
                    <>
                        <h3 className="text-xl font-bold mb-4">
                            Chat del Grupo: {groups.find((group) => group.id === activeGroup).name}
                        </h3>
                        <div className="messages">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`${message.user} flex flex-col p-3 rounded-lg`}
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
                    <p className="text-gray-600">Selecciona un grupo para ver el chat.</p>
                )}
            </div>
        </div>
    );
};

export default MyGroups;