import axios from 'axios';
const BASE_URL = 'http://localhost:8888/discount';
export const DiscountApi = {
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
                message: 'Error al obtener descuentos',
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
                message: 'Error al obtener descuento',
                data: []
            };
        }
    },

    create: async (code, fechaCreacion, fechaFinalizacion, porcentaje, accessToken) => {
        try {
            const response = await axios.post(`${BASE_URL}`, 
                { code, fecha_creacion: fechaCreacion, fecha_finalizacion: fechaFinalizacion, porcentaje }, 
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el descuento',
                error: error.response ? error.response.data : error.message
            };
        }
    },

    edit: async (id, code, id_status, fecha_creacion, fecha_finalizacion, porcentaje, accessToken) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}/edit`, 
                { code, id_status, fecha_creacion, fecha_finalizacion, porcentaje }, 
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: 'Error al editar el descuento',
                error: error.response ? error.response.data : error.message
            };
        }
    }
};