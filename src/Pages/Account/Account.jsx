import { useState, useEffect } from 'react';
import EditProfile from './EditProfile';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { games_list } from '../../BackEnd/Data/games';
import { reviews } from '../../BackEnd/Data/reviews';
import { groups } from '../../BackEnd/Data/groups';
import { useNavigate } from 'react-router-dom';
import { Star, Edit } from 'lucide-react';
import './Account.css';

const Account = () => {
    const [purchasedGames, setPurchasedGames] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [user, setUser] = useState({
        id: 1,
        name: "Alex González",
        username: "@alexgonzalez",
        joined: "Miembro desde 2023",
        bio: "Apasionado gamer | Streamer ocasional | Coleccionista de juegos retro",
        profileImage: "https://via.placeholder.com/150x150",
        bannerImage: "https://via.placeholder.com/2100x300"
    });

    console.log(user);

    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }

        const savedBuy = localStorage.getItem('gameBuy');
        if (savedBuy) {
            try {
                const parsedPurchases = JSON.parse(savedBuy);

                const purchasedGamesFull = games_list.filter(game => 
                    Array.isArray(parsedPurchases) && parsedPurchases.includes(game.id)
                );
                setPurchasedGames(purchasedGamesFull);
            } catch (error) {
                console.error('Error parsing purchased games:', error);
                setPurchasedGames([]);
            }
        }

        const savedGroups = localStorage.getItem('MisGrupos');
        if (savedGroups) {
            try {
                const parsedGroups = JSON.parse(savedGroups);
                const userGroupsFull = groups.filter(group => parsedGroups.includes(group.id));
                setUserGroups(userGroupsFull);
            } catch (error) {
                console.error('Error parsing user groups:', error);
                setUserGroups([]);
            }
        }

        const userReviews = reviews.filter(review => review.userId === user.id);
        setUserReviews(userReviews);

    }, [isLoggedIn, navigate]);

    const purchaseHistory = [
        { id: 1, game: "Elden Ring", date: "15 Oct 2024", price: "$59.99", image: "/api/placeholder/60/60" },
        { id: 2, game: "Cyberpunk 2077", date: "1 Oct 2024", price: "$49.99", image: "/api/placeholder/60/60" },
        { id: 3, game: "God of War", date: "28 Sep 2024", price: "$39.99", image: "/api/placeholder/60/60" }
    ];

    const handleProfileUpdate = (updatedProfile) => {
        setUser({
            ...user,
            profileImage: updatedProfile.profileImage,
            bannerImage: updatedProfile.bannerImage,
            name: updatedProfile.name,
            bio: updatedProfile.bio
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 margin-perso">
            {/* Perfil */}
            <div className="relative">
                <div className="h-64 overflow-hidden fondo-banner">
                    <img 
                        src={user.bannerImage} 
                        alt="Banner" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute -bottom-16 left-8 user-avatar user-avatar-margin">
                    <div className="relative">
                        <img 
                            src={user.profileImage} 
                            alt={user.name} 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                        />
                        <button className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600" 
                            onClick={() => setIsEditModalOpen(true)} >
                            <Edit size={16} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-600">{user.username}</p>
                        <p className="text-gray-500 text-sm mt-1">{user.joined}</p>
                        <p className="mt-4">{user.bio}</p>
                        
                        <div className="flex justify-between mt-6 pt-6 border-t">
                            <div className="text-center">
                                <div className="font-bold text-xl">{purchasedGames.length}</div>
                                <div className="text-gray-600 text-sm">Juegos</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-xl">{userReviews.length}</div>
                                <div className="text-gray-600 text-sm">Reseñas</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-xl">{userGroups.length}</div>
                                <div className="text-gray-600 text-sm">Grupos</div>
                            </div>
                        </div>
                    </div>

                    {/* Mis Grupos */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Mis Grupos</h2>
                            <button className="text-blue-500 hover:text-blue-600" onClick={() => { navigate("/mygroups") }}>Ver todos</button>
                        </div>
                        <div className="space-y-4">
                            {userGroups.slice(0, 3).map(group => (
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

                    {/* Mis Juegos */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Últimos 3 Juegos</h2>
                            <button 
                            className="text-blue-500 hover:text-blue-600" 
                            onClick={() => navigate("/mylibrary")}
                            >
                            Ver todos
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {purchasedGames.slice(0, 3).map(game => (
                            <div key={game.id} className="flex flex-col">
                                {/* Imagen del juego */}
                                <div className="aspect-[7/4] w-full mb-2">
                                <img 
                                    src={game.image} 
                                    alt={game.title} 
                                    className="w-full h-full object-cover rounded-lg bg-gray-200"
                                />
                                </div>
                                
                                {/* Nombre del juego */}
                                <h3 className="text-blue-500 font-semibold mb-2">
                                {game.title}
                                </h3>

                                {/* Botón Jugar */}
                                <button 
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition w-fit"
                                onClick={() => {/* Acción para jugar */}}
                                >
                                Jugar
                                </button>
                            </div>
                            ))}
                        </div>
                    </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {/* Mis Compras */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Últimas Compras</h2>
                                <button className="text-blue-500 hover:text-blue-600">Ver historial completo</button>
                            </div>
                            <div className="space-y-4">
                            {purchaseHistory.slice(0, 3).map(purchase => (
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

                        {/* Mis Reseñas */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Latest Reviews</h2>
                                <button className="text-blue-500 hover:text-blue-600" onClick={() => { navigate("/myreviews") }}>Ver Todas</button>
                            </div>
                            <div className="space-y-4">
                                {userReviews.slice(0, 3).map(review => (
                                    <div key={review.id} className="p-4 hover:bg-gray-50 rounded-lg transition">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h3 className="font-semibold">{review.gameTitle}</h3>
                                                    <div className="flex items-center">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{review.date}</p>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-gray-700">{review.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <EditProfile user={user} onSave={handleProfileUpdate} onClose={() => setIsEditModalOpen(false)} />
                </div>
            )}
        </div>  
    );
};

export default Account;