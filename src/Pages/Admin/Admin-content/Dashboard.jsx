import { useState, useEffect } from 'react';
import { Users, ShoppingBag, UsersRound, GamepadIcon } from 'lucide-react';
import { UserApi } from '../../../BackEnd/API/UserApi';
import { GroupsApi } from '../../../BackEnd/API/GroupsAPI';
import { GamesAPI } from '../../../BackEnd/API/GamesAPI';
import { PurchaseApi } from '../../../BackEnd/API/PurchasesAPI';
import GraficVentas from './Dashboard-content/GraficVentas';
import StatCard from './Dashboard-content/StatCard';
import './Dashboard.css';

const Dashboard = () => {
    const [statsData, setStatsData] = useState([
        {
            title: "Usuarios Totales",
            value: "0",
            icon: <Users size={24} />,
            iconClass: "icon-blue"
        },
        {
            title: "Ventas totales",
            value: "0",
            icon: <ShoppingBag size={24} />,
            iconClass: "icon-orange"
        },
        {
            title: "Grupos Totales",
            value: "0",
            icon: <UsersRound size={24} />,
            iconClass: "icon-cyan"
        },
        {
            title: "Juegos en Venta",
            value: "0",
            icon: <GamepadIcon size={24} />,
            iconClass: "icon-purple"
        }
    ]);

    const [purchaseData, setPurchaseData] = useState([]);
    const [gamesData, setGamesData] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const accessToken = localStorage.getItem('token');
                
                const userTotal = await UserApi.getUsers(accessToken);
                const purchaseTotal = await PurchaseApi.getAll(accessToken);
                const groupsTotal = await GroupsApi.getAllGroups();
                const gamesTotal = await GamesAPI.getAllGames();
                const allCategories = await GamesAPI.getCategories();

                setPurchaseData(purchaseTotal.data);
                setGamesData(gamesTotal.data);
                setCategories(allCategories.data);

                setStatsData([
                    {
                        ...statsData[0],
                        value: userTotal.user[0].length.toString()
                    },
                    {
                        ...statsData[1],
                        value: purchaseTotal.data.length.toString()
                    },
                    {
                        ...statsData[2],
                        value: groupsTotal.data.length.toString()
                    },
                    {
                        ...statsData[3],
                        value: gamesTotal.data.length.toString()
                    }
                ]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <>
            <div className="stats-container">
                {statsData.map((stat, index) => (
                    <StatCard key={index} stat={stat} />
                ))}
            </div>
            <GraficVentas 
                purchaseData={purchaseData} 
                gamesData={gamesData} 
                allCategories={categories}
            />
        </>
    );
};

export default Dashboard;