const UserInfo = ({ user, stats }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.username}</p>
            <p className="text-gray-500 text-sm mt-1">{user.joined}</p>
            <p className="mt-4">{user.bio}</p>
            
            <div className="flex justify-between mt-6 pt-6 border-t">
                <StatItem label="Juegos" value={stats.games} />
                <StatItem label="Reseñas" value={stats.reviews} />
                <StatItem label="Grupos" value={stats.groups} />
            </div>
        </div>
    );
};

const StatItem = ({ label, value }) => (
    <div className="text-center">
        <div className="font-bold text-xl">{value}</div>
        <div className="text-gray-600 text-sm">{label}</div>
    </div>
);

  export default UserInfo;