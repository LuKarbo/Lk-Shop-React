const UserInfo = ({ user, stats }) => {
    const formattedDate = new Date(user.registro_creado).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
   
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold">{user.nombre}</h1>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500 text-sm mt-1">Se unió el {formattedDate}</p>
        
        {user.bio && <p className="mt-4">{user.bio}</p>}
        
        <div className="flex justify-between mt-6 pt-6 border-t">
          <StatItem label="Juegos" value={stats.games} />
          <StatItem label="Reseñas" value={stats.reviews} />
          <StatItem label="Grupos" value={stats.groups} />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <span className="mr-2">Estado: {user.status_name}</span>
          <span>Permisos: {user.permissions_name}</span>
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