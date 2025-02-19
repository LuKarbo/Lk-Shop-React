import axios from 'axios';

const BASE_URL = 'http://localhost:8888/purchases';

export const PurchaseApi = {
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
            const response = await axios.get(`${BASE_URL}/${id}`, {
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
    }
};