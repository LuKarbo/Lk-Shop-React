import { Users, ShoppingBag, UsersRound, GamepadIcon } from 'lucide-react';
import './Dashboard.css';

const statsData = [
    {
        title: "Usuarios",
        value: "152",
        icon: <Users size={24} />,
        iconClass: "icon-blue",
        increment: "24 nuevos",
        subtitle: "desde la última visita"
    },
    {
        title: "Compras de la Semana",
        value: "$2,100",
        icon: <ShoppingBag size={24} />,
        iconClass: "icon-orange",
        increment: "%52+",
        subtitle: "desde la semana pasada"
    },
    {
        title: "Grupos",
        value: "28,441",
        icon: <UsersRound size={24} />,
        iconClass: "icon-cyan",
        increment: "520",
        subtitle: "nuevos registrados"
    },
    {
        title: "Juegos en Venta",
        value: "152",
        icon: <GamepadIcon size={24} />,
        iconClass: "icon-purple",
        increment: "85",
        subtitle: "nuevos juegos"
    }
];

const StatCard = ({ stat }) => (
    <div className="stat-card">
        <div className="stat-header">
            <div className="stat-content">
                <span className="stat-title">{stat.title}</span>
                <div className="stat-value">{stat.value}</div>
            </div>
            <div className={`stat-icon ${stat.iconClass}`}>
                {stat.icon}
            </div>
        </div>
        <div className="stat-footer">
            <span className="stat-increment">{stat.increment} </span>
            <span className="stat-subtitle">{stat.subtitle}</span>
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <div className="stats-container">
            {statsData.map((stat, index) => (
                <StatCard key={index} stat={stat} />
            ))}
        </div>
    );
};

export default Dashboard;