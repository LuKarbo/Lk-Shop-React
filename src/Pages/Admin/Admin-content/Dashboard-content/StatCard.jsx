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

export default StatCard;