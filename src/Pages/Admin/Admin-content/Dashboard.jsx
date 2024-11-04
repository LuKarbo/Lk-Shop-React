import { Users, ShoppingBag, UsersRound, GamepadIcon } from 'lucide-react';
import GraficVentas from './Dashboard-content/GraficVentas';
import StatCard from './Dashboard-content/StatCard';
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

const Dashboard = () => {
    return (
        <>
            <div className="stats-container">
                {statsData.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>
            <GraficVentas/>
        </>
    );
};

export default Dashboard;