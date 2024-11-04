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
        <div className="stat-card chart-card">
            <div className="chart-header">
                <h3>Ventas por Categoría</h3>
                <p>Última Semana</p>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="#E5E7EB" 
                            vertical={false}
                        />
                        <XAxis 
                            dataKey="day" 
                            tick={{fill: '#6B7280'}}
                            axisLine={{stroke: '#E5E7EB'}}
                        />
                        <YAxis 
                            tick={{fill: '#6B7280'}}
                            axisLine={{stroke: '#E5E7EB'}}
                            tickLine={false}
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                padding: '0.75rem'
                            }}
                        />
                        <Legend 
                            wrapperStyle={{
                                paddingTop: '1rem'
                            }}
                        />
                        <Bar dataKey="Acción" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Aventura" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Deportes" fill="#F97316" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="RPG" fill="#9333EA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GraficVentas;