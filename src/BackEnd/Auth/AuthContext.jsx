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
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        
        const userIsAdmin = checkIfAdmin(email);
        if (userIsAdmin) {
            localStorage.setItem('isAdmin', 'true');
            setIsAdmin(true);
        }
        
        User.createInstance({
            email,
            isAdmin: userIsAdmin
        });
        
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear();
        
        User.destroyInstance();
        
        setIsAdmin(false);
        setIsLoggedIn(false);
    };

    const updateUserProfile = (updatedProfile) => {
        localStorage.setItem('profileImage', updatedProfile.profileImage);
        localStorage.setItem('bannerImage', updatedProfile.bannerImage);
        localStorage.setItem('name', updatedProfile.name);
        localStorage.setItem('bio', updatedProfile.bio);
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            isAdmin, 
            login, 
            logout,
            currentUser: User.getInstance(),
            updateUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
