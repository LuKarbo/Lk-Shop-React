import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('email'));
    const [isAdmin, setIsAdmin] = useState(false);

    const login = (email, password) => {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        setIsAdmin(true)
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

