import axios from 'axios';

const BASE_URL = 'http://localhost:8888';

export const GroupsApi = {
    getAllGroups: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/groups`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener grupos'
            };
        }
    },

    getUserGroups: async (userId, accessToken) => {
        try {
            const response = await axios.get(`${BASE_URL}/groups/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener grupos del usuario'
            };
        }
    },

    getGroupMessages: async (groupId, accessToken) => {
        try {
            const response = await axios.get(`${BASE_URL}/groups/${groupId}/messages`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener mensajes del grupo'
            };
        }
    },

    createGroup: async (name, description, groupBanner, ownerId, accessToken, categories) => {
        try {
            const response = await axios.post(`${BASE_URL}/groups`, 
                { name, description, groupBanner, ownerId, categories },
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el grupo'
            };
        }
    },

    sendMessage: async (groupId, userId, message, accessToken) => {
        try {
            const response = await axios.post(`${BASE_URL}/groups/${groupId}/messages`, 
                { userId, message },
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al enviar el mensaje'
            };
        }
    },

    leaveGroup: async (groupId, userId, accessToken) => {
        try {
            const response = await axios.put(`${BASE_URL}/groups/${groupId}/leave`, 
                { userId },
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response.data.message
            };
        }
    },

    editGroup: async (groupId, name, groupImg, groupBanner, accessToken) => {
        try {
            const response = await axios.put(`${BASE_URL}/groups/${groupId}`, 
                { name, groupImg, groupBanner },
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al editar el grupo'
            };
        }
    },

    deleteGroup: async (groupId, accessToken) => {
        try {
            const response = await axios.delete(`${BASE_URL}/groups/${groupId}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el grupo'
            };
        }
    },

    joinGroup: async (groupId, userId, accessToken) => {
        try {
            const response = await axios.post(`${BASE_URL}/groups/${groupId}/join`, 
                { userId },
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al unirse al grupo'
            };
        }
    }
};