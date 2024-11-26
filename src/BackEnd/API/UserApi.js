import axios from 'axios';

const BASE_URL = 'http://localhost:8888/user';

export const UserApi = {
    login: async (email, password) => {
        try {        
            const response = await axios.post(`${BASE_URL}/login`, {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                console.log(response);
                return {
                    success: true,
                    user: {
                        id: response.data.user.id_user,
                        email: response.data.user.email,
                        nombre: response.data.user.nombre,
                        permisos: response.data.user.id_permissions
                    },
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                };
            } else {
                return {
                    success: false,
                    message: response.data.message
                };
            }
        } catch (error) {
            return {
                success: false,
                message: 'Error al iniciar sesión. Por favor, intente nuevamente.'
            };
        }
    },

    getCurrentUser: async (userId, accessToken) => {
        try {
            console.log(userId);
            console.log(accessToken);
            const response = await axios.get(`${BASE_URL}/getUser/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return {
                success: true,
                user: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener información del usuario'
            };
        }
    }
};