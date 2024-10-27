import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('email'));
    const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('isAdmin'));

    const checkIfAdmin = (email) => {
        const adminEmails = ['asd@gmail.com'];
        return adminEmails.includes(email);
    };

    const login = (email, password) => {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        
        const userIsAdmin = checkIfAdmin(email);
        if (userIsAdmin) {
            localStorage.setItem('isAdmin', 'true');
            setIsAdmin(true);
        }
        
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('isAdmin');
        setIsAdmin(false);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);