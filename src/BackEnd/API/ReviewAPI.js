import axios from 'axios';

const BASE_URL = 'http://localhost:8888/review';

export const ReviewApi = {
    getAll: async (accessToken) => {
        try {
            const response = await axios.get(`${BASE_URL}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener consultas',
                data: []
            };
        }
    },

    getById: async (id, accessToken) => {
        try {
            const response = await axios.get(`${BASE_URL}/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener consulta',
                data: []
            };
        }
    },

    createReview: async (userId, gameId, content, score, accessToken) => {
        try {
            const response = await axios.post(`${BASE_URL}`, 
                { userId, gameId, content, score },
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el grupo'
            };
        }
    }
};