import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficVentas = () => {
    const salesData = [
        { day: 'Lunes', Acción: 65, Aventura: 45, Deportes: 35, RPG: 28 },
        { day: 'Martes', Acción: 59, Aventura: 49, Deportes: 38, RPG: 32 },
        { day: 'Miércoles', Acción: 80, Aventura: 55, Deportes: 42, RPG: 35 },
        { day: 'Jueves', Acción: 75, Aventura: 58, Deportes: 40, RPG: 30 },
        { day: 'Viernes', Acción: 90, Aventura: 65, Deportes: 45, RPG: 38 },
        { day: 'Sábado', Acción: 100, Aventura: 70, Deportes: 50, RPG: 42 },
        { day: 'Domingo', Acción: 85, Aventura: 60, Deportes: 48, RPG: 40 }
    ];

    return (
        <div className="section-card">
            <div className="section-header">
                <h2>Ventas por Categoría - Última Semana</h2>
            </div>
            <div className="chart-container">
                <ResponsiveContainer>
                    <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Acción" fill="#8884d8" />
                        <Bar dataKey="Aventura" fill="#82ca9d" />
                        <Bar dataKey="Deportes" fill="#ffc658" />
                        <Bar dataKey="RPG" fill="#ff7300" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GraficVentas;