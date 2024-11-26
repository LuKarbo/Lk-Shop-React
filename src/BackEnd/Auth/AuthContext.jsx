import { createContext, useContext, useState } from 'react';
import User from '../Model/User';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('isAdmin'));

    const checkIfAdmin = (user) => {
        const adminEmails = ['asd@gmail.com'];
        return adminEmails.includes(user.email);
    };

    const login = (user) => {
        
        const userData = Array.isArray(user) && user.length > 0 ? user[0] : user;
    
        const userIsAdmin = checkIfAdmin(userData);
    
        if (userIsAdmin) {
            localStorage.setItem('isAdmin', 'true');
            setIsAdmin(true);
        }
    
        const userInstanceData = {
            id: userData.id_user,
            email: userData.email,
            name: userData.nombre,
            id_permissions: userData.permissions_name,
            profileIMG: userData.profileIMG,
            profileBanner: userData.profileBanner,
            isAdmin: userData.id_permissions !== "User",
            status_name: userData.status_name
        };
    
        User.createInstance(userInstanceData);
    
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear();
        User.destroyInstance();
        setIsAdmin(false);
        setIsLoggedIn(false);
    };

    axios.interceptors.request.use(
        config => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);