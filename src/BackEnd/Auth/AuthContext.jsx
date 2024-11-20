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
        const userIsAdmin = checkIfAdmin(user);

        if (userIsAdmin) {
            localStorage.setItem('isAdmin', 'true');
            setIsAdmin(true);
        }

        User.createInstance({
            id: user.id_user,
            email: user.email,
            name: user.nombre,
            isAdmin: user.id_permissions == 2 ? true : false
        });

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