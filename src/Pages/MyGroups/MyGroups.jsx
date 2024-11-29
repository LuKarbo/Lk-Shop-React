import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { GroupsApi } from '../../BackEnd/API/GroupsAPI';
import { X } from 'lucide-react';
import "./MyGroups.css";

const MyGroups = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const [myGroups, setMyGroups] = useState([]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [selectedGroupToDelete, setSelectedGroupToDelete] = useState(null);
    const [selectedGroupToLeave, setSelectedGroupToLeave] = useState(null);
    const userId = localStorage.getItem('user');
    const accessToken = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserGroups = async () => {
            if (!isLoggedIn || !userId) {
                navigate('/login');
                return;
            }

            try {
                const response = await GroupsApi.getUserGroups(userId, accessToken);
                if (response.success !== false) {
                    setMyGroups(response.data);
                }
            } catch (error) {
                console.error("Error fetching user groups:", error);
            }
        };

        fetchUserGroups();
    }, [isLoggedIn, userId, navigate, accessToken]);

    useEffect(() => {
        const fetchGroupMessages = async () => {
            if (!activeGroup) return;

            try {
                const response = await GroupsApi.getGroupMessages(activeGroup, accessToken);
                if (response.success !== false) {
                    setMessages(response.data.map(msg => ({
                        id: msg.mensaje_id,
                        message: msg.mensaje,
                        name: msg.usuario_nombre,
                        createdAt: msg.fecha,
                        user: msg.id_user == userId ? "my" : "other"
                    })));
                }
            } catch (error) {
                console.error("Error fetching group messages:", error);
            }
        };

        fetchGroupMessages();
        
        const intervalId = setInterval(fetchGroupMessages, 5000);
        return () => clearInterval(intervalId);
    }, [activeGroup, userId, accessToken]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            const messagesContainer = messagesEndRef.current.closest('.messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeGroup, messages]);

    const handleGroupClick = (groupId) => {
        setActiveGroup(groupId);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !activeGroup) return;

        try {
            const response = await GroupsApi.sendMessage(
                activeGroup, 
                userId, 
                inputMessage, 
                accessToken
            );

            if (response.success !== false) {
                setInputMessage("");
                
                const updatedMessages = await GroupsApi.getGroupMessages(activeGroup, accessToken);
                setMessages(updatedMessages.data.map(msg => ({
                    id: msg.mensaje_id,
                    message: msg.mensaje,
                    name: msg.usuario_nombre,
                    createdAt: msg.fecha,
                    user: msg.id_user == userId ? "my" : "other"
                })));
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleLeaveGroup = (group) => {
        setSelectedGroupToLeave(group);
        setShowLeaveModal(true);
    };

    const confirmLeaveGroup = async () => {
        try {
            const response = await GroupsApi.leaveGroup(selectedGroupToLeave.id_group, userId, accessToken);
            
            if (response.success !== false) {
                setMyGroups(prevGroups => prevGroups.filter(group => group.id_group !== selectedGroupToLeave.id_group));
                
                if (activeGroup === selectedGroupToLeave.id_group) {
                    setActiveGroup(null);
                }
            }
        } catch (error) {
            console.error("Error leaving group:", error);
        }
        setShowLeaveModal(false);
        setSelectedGroupToLeave(null);
    };

    const handleDeleteGroup = (group) => {
        setSelectedGroupToDelete(group);
        setShowDeleteModal(true);
    };

    const confirmDeleteGroup = async () => {
        try {
            const response = await GroupsApi.deleteGroup(selectedGroupToDelete.id_group, accessToken);
            if (response.success !== false) {
                setMyGroups(prevGroups => prevGroups.filter(group => group.id_group !== selectedGroupToDelete.id_group));
                
                if (activeGroup === selectedGroupToDelete.id_group) {
                    setActiveGroup(null);
                }
            }
        } catch (error) {
            console.error("Error deleting group:", error);
        }
        setShowDeleteModal(false);
        setSelectedGroupToDelete(null);
    };
    
    return (
        <div className="chat-view">
            <div className="group-list">
                <h3 className="text-xl font-bold mb-4">Mis Grupos</h3>
                <ul>
                    {myGroups.map((group) => (
                        <li
                            key={group.id_group}
                            className={`flex items-center p-2 hover:bg-gray-200 cursor-pointer ${
                                activeGroup === group.id_group ? 'bg-gray-200' : ''
                            }`}
                            onClick={() => handleGroupClick(group.id_group)}
                        >
                            <div 
                                className="group-icon mr-2"
                                style={{ backgroundImage: `url(${group.groupbanner || "https://via.placeholder.com/800x600"})` }}
                            ></div>
                            <div className="flex flex-col flex-1">
                                <span className="font-medium">{group.group_name}</span>
                                <span className="text-sm text-gray-500">
                                    Rol: {group.rol_nombre} 
                                </span>
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
                            <div className="chat-header-info">
                                <h3 className="text-xl font-bold mb-4">
                                    {myGroups.find((group) => group.id_group === activeGroup)?.group_name}
                                </h3>
                                <div className="text-sm text-gray-500">
                                    Rol: {myGroups.find((group) => group.id_group === activeGroup)?.rol_nombre}
                                </div>
                            </div>
                            <div className="chat-header-actions">
                                {myGroups.find((group) => group.id_group === activeGroup)?.rol_nombre === "Owner" ? (
                                    <button
                                        onClick={() => handleDeleteGroup(myGroups.find((group) => group.id_group === activeGroup))}
                                        className="delete-button"
                                    >
                                        Eliminar Grupo
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleLeaveGroup(myGroups.find((group) => group.id_group === activeGroup))}
                                        className="leave-button"
                                    >
                                        Salir del Grupo
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="messages overflow-y-auto">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.user} flex flex-col p-3 rounded-lg mb-2 ${
                                        message.user === "my" 
                                            ? "self-end bg-blue-100 text-right" 
                                            : "self-start bg-gray-100"
                                    }`}
                                    style={{
                                        alignSelf: message.user === "my" ? "flex-end" : "flex-start",
                                        maxWidth: "75%",
                                        marginLeft: message.user === "my" ? "auto" : "0",
                                        marginRight: message.user === "my" ? "0" : "auto"
                                    }}
                                >
                                    <div className={`message-user font-medium ${message.user === "my" ? "text-blue-700" : "text-gray-700"}`}>
                                        {message.name}
                                    </div>
                                    <div className="message-text">{message.message}</div>
                                    <div className="message-timestamp text-gray-500 text-sm">
                                        {new Date(message.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
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

            {showLeaveModal && selectedGroupToLeave && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Confirmar Salida</h2>
                            <button
                                onClick={() => {
                                    setShowLeaveModal(false);
                                    setSelectedGroupToLeave(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="mb-6">¿Estás seguro que deseas salir del grupo "{selectedGroupToLeave.group_name}"?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowLeaveModal(false);
                                    setSelectedGroupToLeave(null);
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmLeaveGroup}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedGroupToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Confirmar Eliminación</h2>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedGroupToDelete(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="mb-6">¿Estás seguro que deseas eliminar el grupo "{selectedGroupToDelete.group_name}"? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedGroupToDelete(null);
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteGroup}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyGroups;