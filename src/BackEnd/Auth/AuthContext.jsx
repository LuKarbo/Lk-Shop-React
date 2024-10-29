import { createContext, useContext, useState } from 'react';
import User from '../Model/User';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('email'));
    const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('isAdmin'));

    const checkIfAdmin = (email) => {
        const adminEmails = ['asd@gmail.com'];
        return adminEmails.includes(email);
    };

    const login = (email, password) => {
        // Save in localStorage
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        
        const userIsAdmin = checkIfAdmin(email);
        if (userIsAdmin) {
            localStorage.setItem('isAdmin', 'true');
            setIsAdmin(true);
        }
        
        // Create User instance
        User.createInstance({
            email,
            isAdmin: userIsAdmin
        });
        
        setIsLoggedIn(true);
    };

    const logout = () => {
        // Clear localStorage
        localStorage.clear();
        
        // Destroy User instance
        User.destroyInstance();
        
        setIsAdmin(false);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            isAdmin, 
            login, 
            logout,
            // Also expose the current user instance
            currentUser: User.getInstance()
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);