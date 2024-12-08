import { useState } from 'react';
import Sidebar from './Admin-content/Sidebar';
import Dashboard from './Admin-content/Dashboard';
import UserManagement from './Admin-content/UserManagement';
import SupportManagement from './Admin-content/SupportManagement';
import GamesManagement from './Admin-content/GamesManagement';
import GroupsManagement from './Admin-content/GroupsManagement';
import SalesManagement from './Admin-content/SalesManagement';
import './Admin.css';

const Admin = () => {
    const [activeSection, setActiveSection] = useState('dashboard');

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <UserManagement />;
            case 'support':
                return <SupportManagement />;
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