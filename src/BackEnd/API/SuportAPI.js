import axios from 'axios';

const BASE_URL = 'http://localhost:8888/support';

export const SupportApi = {
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
                message: 'Error al obtener consultas'
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
                message: 'Error al obtener consulta'
            };
        }
    },

    create: async (id_user, title, content, accessToken) => {
        try {
            const response = await axios.post(`${BASE_URL}`, {
                id_user,
                title,
                content
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear la consulta'
            };
        }
    },

    reply: async (id, id_admin, response, accessToken) => {
        try {
            const result = await axios.put(`${BASE_URL}/${id}/reply`, {
                id_admin,
                response
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return result.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al responder la consulta'
            };
        }
    }
};