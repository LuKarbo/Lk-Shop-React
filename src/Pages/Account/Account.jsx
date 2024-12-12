import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import EditProfile from './EditProfile';
import { UserApi } from '../../BackEnd/API/UserApi';
import { GamesAPI } from '../../BackEnd/API/GamesAPI';
import { GroupsApi } from '../../BackEnd/API/GroupsAPI';
import { PurchaseApi } from '../../BackEnd/API/PurchasesAPI';
import { ReviewApi } from '../../BackEnd/API/ReviewAPI';
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
    const [userPurchases, setuserPurchases] = useState([]);
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
                const userPurchases = await PurchaseApi.getById(userId, accessToken);
                const userReviews = await ReviewApi.getById(userId,accessToken);

                setUser(userAccount.user[0]);
                setPurchasedGames(userGames.data);
                setUserGroups(userGroups.data);
                setuserPurchases(userPurchases);
                setUserReviews(userReviews);

            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [isLoggedIn, navigate]);

    const handleProfileUpdate = async (updatedProfile) => {
        try {
            const result = await UserApi.editUser(
                userId, 
                updatedProfile.name, 
                updatedProfile.bio, 
                updatedProfile.profileImage, 
                updatedProfile.bannerImage, 
                accessToken
            );
    
            if (result.success && result.user) {
                setUser(prevUser => ({
                    ...prevUser,
                    nombre: updatedProfile.name,
                    bio: updatedProfile.bio,
                    profileIMG: updatedProfile.profileImage,
                    profileBanner: updatedProfile.bannerImage
                }));
                setIsEditModalOpen(false);
            } else {
                console.error('Error updating profile', result.message);
            }
    
            return result;
        } catch (error) {
            console.error('Error in profile update', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const stats = {
        games: purchasedGames.length || 0,
        reviews: userReviews.data.length || 0,
        groups: userGroups.length || 0
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
                purchases={userPurchases.data}
                onViewAll={() => navigate("/mypurchases")}
                />
                <UserReviews 
                reviews={userReviews.data}
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