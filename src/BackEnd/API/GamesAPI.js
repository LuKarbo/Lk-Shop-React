import axios from 'axios';

const BASE_URL = 'http://localhost:8888';

export const GamesAPI = {
    getUserGames: async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/games/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user games:', error);
            throw error;
        }
    },

    purchaseGame: async (userId, gameId) => {
        try {
            const response = await axios.post(`${BASE_URL}/purchase`, { userId, gameId }, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding game to favorites:', error);
            throw error;
        }
    },

    refoundGame: async (userId, gameId) => {
        try {
            const response = await axios.post(`${BASE_URL}/refund`, { userId, gameId }, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding game to favorites:', error);
            throw error;
        }
    },

    getAllGames: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/games`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all games:', error);
            throw error;
        }
    },

    getEditors: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/editors`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all editors:', error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all categories:', error);
            throw error;
        }
    },

    createGame: async (gameData) => {
        try {
            const response = await axios.post(`${BASE_URL}/games`, gameData, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating game:', error);
            throw error;
        }
    },

    editGame: async (gameId, gameData) => {
        try {
            const response = await axios.put(`${BASE_URL}/games/${gameId}`, gameData, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error editing game:', error);
            throw error;
        }
    },

    deleteGame: async (gameId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/games/${gameId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting game:', error);
            throw error;
        }
    },

    getUserFavorites: async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/favorites/${userId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user favorites:', error);
            throw error;
        }
    },

    addToFavorites: async (userId, gameId) => {
        try {
            const response = await axios.post(`${BASE_URL}/favorites`, { userId, gameId }, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding game to favorites:', error);
            throw error;
        }
    },

    removeFromFavorites: async (userId, gameId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/favorites/${userId}/${gameId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error removing game from favorites:', error);
            throw error;
        }
    }
};