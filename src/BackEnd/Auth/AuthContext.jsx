import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('email'));

    const login = (email, password) => {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

