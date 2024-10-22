import { useEffect } from 'react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import {  Star, Edit } from 'lucide-react';
import './Account.css';

const Account = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // REVEER LA CLASE ÚLTIMOS MINUTOS PARA MEJOR IMPLEMENTACIÓN
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);
    // -----------------------------------------------------

  // Datos de ejemplo
    const user = {
        name: "Alex González",
        username: "@alexgonzalez",
        joined: "Miembro desde 2023",
        bio: "Apasionado gamer | Streamer ocasional | Coleccionista de juegos retro",
        profileImage: "https://via.placeholder.com/150x150",
        bannerImage: "https://via.placeholder.com/2100x300",
        stats: {
            games: 142,
            reviews: 38,
            groups: 5
        }
    };

    const purchaseHistory = [
        { id: 1, game: "Elden Ring", date: "15 Oct 2024", price: "$59.99", image: "/api/placeholder/60/60" },
        { id: 2, game: "Cyberpunk 2077", date: "1 Oct 2024", price: "$49.99", image: "/api/placeholder/60/60" },
        { id: 3, game: "God of War", date: "28 Sep 2024", price: "$39.99", image: "/api/placeholder/60/60" }
    ];

    const reviews = [
        { id: 1, game: "Elden Ring", rating: 5, comment: "Una obra maestra absoluta...", date: "16 Oct 2024", image: "/api/placeholder/60/60" },
        { id: 2, game: "Cyberpunk 2077", rating: 4, comment: "Después de los parches, es un gran juego...", date: "2 Oct 2024", image: "/api/placeholder/60/60" },
        { id: 3, game: "God of War", rating: 5, comment: "Una historia inolvidable...", date: "29 Sep 2024", image: "/api/placeholder/60/60" }
    ];

    const groups = [
        { id: 1, name: "RPG Lovers", members: 1542, image: "/api/placeholder/80/80" },
        { id: 2, name: "Speedrunners Pro", members: 873, image: "/api/placeholder/80/80" },
        { id: 3, name: "Retro Gaming", members: 2341, image: "/api/placeholder/80/80" }
    ];

return (
    <div className="min-h-screen bg-gray-100">
        {/* Banner y Foto de Perfil */}
        <div className="relative">
            <div className="h-64 overflow-hidden fondo-banner">
                <img 
                    src={user.bannerImage} 
                    alt="Banner" 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute -bottom-16 left-8 user-avatar">
                <div className="relative">
                    <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                    />
                    <button className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600">
                        <Edit size={16} />
                    </button>
                </div>
            </div>
        </div>
        {/* Información Principal */}
        <div className="container mx-auto px-4 pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda - Info Principal */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-gray-600">{user.username}</p>
                    <p className="text-gray-500 text-sm mt-1">{user.joined}</p>
                    <p className="mt-4">{user.bio}</p>
                    
                    <div className="flex justify-between mt-6 pt-6 border-t">
                        <div className="text-center">
                            <div className="font-bold text-xl">{user.stats.games}</div>
                            <div className="text-gray-600 text-sm">Juegos</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl">{user.stats.reviews}</div>
                            <div className="text-gray-600 text-sm">Reseñas</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xl">{user.stats.groups}</div>
                            <div className="text-gray-600 text-sm">Grupos</div>
                        </div>
                    </div>
                </div>

            {/* Grupos */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Mis Grupos</h2>
                        <button className="text-blue-500 hover:text-blue-600">Ver todos</button>
                    </div>
                    <div className="space-y-4">
                        {groups.map(group => (
                        <div key={group.id} className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg transition">
                            <img src={group.image} alt={group.name} className="w-12 h-12 rounded-lg" />
                            <div className="flex-1">
                            <h3 className="font-semibold">{group.name}</h3>
                            <p className="text-sm text-gray-600">{group.members} miembros</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                </div>

            {/* Columna Derecha - Historiales */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Historial de Compras */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Últimas Compras</h2>
                            <button className="text-blue-500 hover:text-blue-600">Ver historial completo</button>
                        </div>
                        <div className="space-y-4">
                        {purchaseHistory.map(purchase => (
                        <div key={purchase.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition">
                            <img src={purchase.image} alt={purchase.game} className="w-16 h-16 rounded-lg" />
                            <div className="flex-1">
                                <h3 className="font-semibold">{purchase.game}</h3>
                                <p className="text-sm text-gray-600">{purchase.date}</p>
                            </div>
                            <div className="text-green-600 font-semibold">{purchase.price}</div>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Reseñas */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Últimas Reseñas</h2>
                            <button className="text-blue-500 hover:text-blue-600">Ver todas</button>
                        </div>
                        <div className="space-y-4">
                            {reviews.map(review => (
                            <div key={review.id} className="p-4 hover:bg-gray-50 rounded-lg transition">
                                <div className="flex items-center space-x-4">
                                <img src={review.image} alt={review.game} className="w-16 h-16 rounded-lg" />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                    <h3 className="font-semibold">{review.game}</h3>
                                    <div className="flex items-center">
                                        {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{review.date}</p>
                                </div>
                                </div>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
    );
};

export default Account;