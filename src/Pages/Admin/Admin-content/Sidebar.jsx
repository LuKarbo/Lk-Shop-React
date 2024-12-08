import { Users, GamepadIcon, UsersRound, ShoppingBag, BarChart3, Ticket } from 'lucide-react';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'Usuarios', icon: <Users size={20} /> },
    { id: 'support', label: 'Consultas', icon: <Ticket size={20} /> },
    { id: 'games', label: 'Juegos', icon: <GamepadIcon size={20} /> },
    { id: 'groups', label: 'Grupos', icon: <UsersRound size={20} /> },
    { id: 'sales', label: 'Compras', icon: <ShoppingBag size={20} /> },
];

const Sidebar = ({ activeSection, setActiveSection }) => {
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