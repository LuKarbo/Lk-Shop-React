import { useState, useEffect } from 'react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Admin-content/Sidebar';
import Dashboard from './Admin-content/Dashboard';
import UserManagement from './Admin-content/UserManagement';
import GamesManagement from './Admin-content/GamesManagement';
import GroupsManagement from './Admin-content/GroupsManagement';
import SalesManagement from './Admin-content/SalesManagement';
import './Admin.css';

const Admin = () => {
    const { isLoggedIn, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');

    useEffect(() => {
        if (!isLoggedIn || !isAdmin) {
            navigate('/login');
        }
    }, [isLoggedIn, isAdmin, navigate]);

    if (!isLoggedIn || !isAdmin) {
        return null;
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <UserManagement />;
            case 'games':
                return <GamesManagement />;
            case 'groups':
                return <GroupsManagement />;
            case 'sales':
                return <SalesManagement />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="admin-container">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <main className="admin-main">
                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Admin;