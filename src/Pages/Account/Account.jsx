import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import EditProfile from './EditProfile';
import { UserApi } from '../../BackEnd/API/UserApi';
import { GamesAPI } from '../../BackEnd/API/GamesAPI';
import { GroupsApi } from '../../BackEnd/API/GroupsAPI';
import ProfileHeader from './components/ProfileHeader';
import UserInfo from './components/UserInfo';
import UserGroups from './components/UserGroups';
import UserGames from './components/UserGames';
import PurchaseHistory from './components/PurchaseHistory';
import UserReviews from './components/UserReviews';

import './Account.css';

const Account = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [purchasedGames, setPurchasedGames] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem('user');
    const accessToken = localStorage.getItem('token');
    
    useEffect(() => {
        const fetchUserData = async () => {
            if (!isLoggedIn) {
                navigate('/login');
                return;
            }

            try {
                const userAccount = await UserApi.getCurrentUser(userId, accessToken);
                const userGames = await GamesAPI.getUserGames(userId);
                const userGroups = await GroupsApi.getUserGroups(userId, accessToken);
                console.log(userAccount.user[0]);
                console.log(userGames.data);
                console.log(userGroups.data);
                setUser(userAccount.user[0]);
                setPurchasedGames(userGames.data);
                setUserGroups(userGroups.data);

                // crear el apartado de reviews
                // const userReviews = await ReviewApi.getUserReviews(userId);
                // setUserReviews(userReviews);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [isLoggedIn, navigate]);

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

    if (loading) {
        return <div>Loading...</div>;
    }

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