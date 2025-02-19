import { useState, useEffect } from 'react';
import { Users, GamepadIcon, UsersRound, ShoppingBag, BarChart3, Ticket } from 'lucide-react';
import { UserApi } from '../../../BackEnd/API/UserApi';

const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} />, allowedRoles: ['Admin', 'Support'] },
    { id: 'users', label: 'Usuarios', icon: <Users size={20} />, allowedRoles: ['Admin'] },
    { id: 'support', label: 'Consultas', icon: <Ticket size={20} />, allowedRoles: ['Admin', 'Support'] },
    { id: 'games', label: 'Juegos', icon: <GamepadIcon size={20} />, allowedRoles: ['Admin'] },
    { id: 'groups', label: 'Grupos', icon: <UsersRound size={20} />, allowedRoles: ['Admin'] },
    { id: 'sales', label: 'Compras', icon: <ShoppingBag size={20} />, allowedRoles: ['Admin'] },
];

const Sidebar = ({ activeSection, setActiveSection }) => {
    const [userRole, setUserRole] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const accessToken = localStorage.getItem('token');
                const userId = localStorage.getItem('user');
                
                const user = await UserApi.getCurrentUser(userId, accessToken);
                const role = user.user[0].permissions_name;
                
                setUserRole(role);
                
                const filteredItems = allMenuItems.filter(item => 
                    item.allowedRoles.includes(role)
                );
                
                setMenuItems(filteredItems);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    if (!userRole) {
        return null;
    }

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2>Admin Menu</h2>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(item.id)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;