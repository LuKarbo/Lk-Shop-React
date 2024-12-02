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
    },

    register: async (nombre, email, password) => {
        try {        
            const response = await axios.post(`${BASE_URL}/register`, {
                nombre: nombre,
                email: email,
                contrasena: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                return {
                    success: true
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
    } ,

    editUser: async (userId, nombre, bio, profileIMG, profileBanner, accessToken) => {
        try {        
            const response = await axios.put(`${BASE_URL}/getUser/${userId}/edit`, {
                nombre: nombre,
                bio: bio,
                profileIMG: profileIMG,
                profileBanner: profileBanner
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                return {
                    success: true,
                    user: response.data.user,
                    message: response.data.message
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
                message: error.response?.data?.message || 'Error al actualizar usuario. Por favor, intente nuevamente.'
            };
        }
    },

    getUsers: async(accessToken) => {
        try {
            const response = await axios.get(`${BASE_URL}/getUser`, {
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