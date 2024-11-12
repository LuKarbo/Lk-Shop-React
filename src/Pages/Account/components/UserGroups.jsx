const UserGroups = ({ groups, onViewAll }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Mis Grupos</h2>
                <button className="text-blue-500 hover:text-blue-600" onClick={onViewAll}>
                    Ver todos
                </button>
            </div>
            <div className="space-y-4">
                {groups.slice(0, 3).map(group => (
                    <GroupItem key={group.id} group={group} />
                ))}
            </div>
        </div>
    );
};

const GroupItem = ({ group }) => (
    <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg transition">
        <img src={group.image} alt={group.name} className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
            <h3 className="font-semibold">{group.name}</h3>
            <p className="text-sm text-gray-600">{group.members} miembros</p>
        </div>
    </div>
);

export default UserGroups;