const TopGroup = () => {
    const topGroups = [
        { id: 1, name: "Gaming Masters", members: 15000, image: "https://via.placeholder.com/100x100" },
        { id: 2, name: "Pro Gamers", members: 12000, image: "https://via.placeholder.com/100x100" },
        { id: 3, name: "Casual Players", members: 10000, image: "https://via.placeholder.com/100x100" }
    ];

    return (
        <div className="section-card">
            <div className="section-header">
                <h2>Grupos Más Populares</h2>
            </div>
            <div className="top-groups-grid">
                {topGroups.map(group => (
                    <div key={group.id} className="group-card">
                        <img src={group.image} alt={group.name} className="group-image" />
                        <div className="group-info">
                            <h3 className="group-name">{group.name}</h3>
                            <p className="group-members">{group.members.toLocaleString()} miembros</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopGroup;