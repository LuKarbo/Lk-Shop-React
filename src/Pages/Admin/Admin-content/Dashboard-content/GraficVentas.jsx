import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficVentas = ({ purchaseData, gamesData, allCategories }) => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        if (!purchaseData?.length || !gamesData?.length || !allCategories?.length) {
            setSalesData([]);
            return;
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentPurchases = purchaseData.filter(purchase => 
            new Date(purchase.fecha) >= sevenDaysAgo
        );

        const gameCategoryMap = gamesData.reduce((acc, game) => {
            if (!game?.categorias) return acc;
            
            const gameCategories = allCategories
                .filter(category => 
                    game.categorias.split(', ')
                        .map(cat => cat.trim())
                        .includes(category.nombre)
                )
                .map(category => category.nombre);

            acc[game.game_name] = gameCategories;
            return acc;
        }, {});

        const salesByDay = {};
        const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        dayOrder.forEach(day => {
            salesByDay[day] = {
                day,
                ...(allCategories?.reduce((acc, cat) => ({
                    ...acc,
                    [cat.nombre]: 0
                }), {}) ?? {})
            };
        });

        recentPurchases.forEach(purchase => {
            const date = new Date(purchase.fecha);
            const day = date.toLocaleDateString('es-ES', { weekday: 'long' });
            const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);

            const gameCategories = gameCategoryMap[purchase.nombre_juego] || [];

            gameCategories.forEach(cat => {
                if (salesByDay[capitalizedDay] && salesByDay[capitalizedDay][cat] !== undefined) {
                    salesByDay[capitalizedDay][cat]++;
                }
            });
        });

        const salesDataArray = Object.values(salesByDay).sort((a, b) => 
            dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
        );

        setSalesData(salesDataArray);
    }, [purchaseData, gamesData, allCategories]);

    if (!allCategories?.length) {
        return (
            <div className="stat-card chart-card">
                <div className="chart-header">
                    <h3>Ventas por Categoría</h3>
                    <p>Última Semana</p>
                </div>
                <div className="chart-container">
                    <p className="text-gray-500 text-center">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stat-card chart-card">
            <div className="chart-header">
                <h3>Ventas por Categoría</h3>
                <p>Última Semana</p>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                        <XAxis dataKey="day" tick={{fill: '#6B7280'}} axisLine={{stroke: '#E5E7EB'}} />
                        <YAxis tick={{fill: '#6B7280'}} axisLine={{stroke: '#E5E7EB'}} tickLine={false} />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                padding: '0.75rem'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '1rem' }} />
                        {allCategories?.map((category, index) => (
                            <Bar 
                                key={category.id_category}
                                dataKey={category.nombre} 
                                fill={`hsl(${(index * 360) / allCategories.length}, 70%, 50%)`}
                                radius={[4, 4, 0, 0]} 
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GraficVentas;