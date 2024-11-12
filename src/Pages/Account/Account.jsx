import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import EditProfile from './EditProfile';
import { games_list } from '../../BackEnd/Data/games';
import { reviews } from '../../BackEnd/Data/reviews';
import { groups } from '../../BackEnd/Data/groups';
import ProfileHeader from './components/ProfileHeader';
import UserInfo from './components/UserInfo';
import UserGroups from './components/UserGroups';
import UserGames from './components/UserGames';
import PurchaseHistory from './components/PurchaseHistory';
import UserReviews from './components/UserReviews';
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
    }, [isLoggedIn, navigate, user.id]);

    const purchaseHistory = [
        { id: 1, game: "Elden Ring", date: "15 Oct 2024", price: "$59.99", image: "/api/placeholder/60/60" },
        { id: 2, game: "Cyberpunk 2077", date: "1 Oct 2024", price: "$49.99", image: "/api/placeholder/60/60" },
        { id: 3, game: "God of War", date: "28 Sep 2024", price: "$39.99", image: "/api/placeholder/60/60" }
    ];

    const handleProfileUpdate = (updatedProfile) => {
        setUser(prevUser => ({
            ...prevUser,           
            name: updatedProfile.name,
            bio: updatedProfile.bio,
            profileImage: updatedProfile.profileImage,
            bannerImage: updatedProfile.bannerImage
        }));
    };

    const stats = {
        games: purchasedGames.length,
        reviews: userReviews.length,
        groups: userGroups.length
    };

    return (
        <div className="min-h-screen bg-gray-100 margin-perso">
        <ProfileHeader 
            user={user} 
            onEditClick={() => setIsEditModalOpen(true)} 
        />

        <div className="container mx-auto px-4 pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <UserInfo user={user} stats={stats} />
                <UserGroups 
                groups={userGroups} 
                onViewAll={() => navigate("/mygroups")} 
                />
                <UserGames 
                games={purchasedGames}
                onViewAll={() => navigate("/mylibrary")}
                />
            </div>

            <div className="lg:col-span-2 space-y-6">
                <PurchaseHistory 
                purchases={purchaseHistory}
                onViewAll={() => {/* navigate a FullHystory (crear la view) */}}
                />
                <UserReviews 
                reviews={userReviews}
                onViewAll={() => navigate("/myreviews")}
                />
            </div>
            </div>
        </div>

        {isEditModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <EditProfile 
                user={user} 
                onSave={handleProfileUpdate} 
                onClose={() => setIsEditModalOpen(false)} 
            />
            </div>
        )}
        </div>
    );
};

export default Account;