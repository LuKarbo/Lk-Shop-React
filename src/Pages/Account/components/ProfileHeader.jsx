import { Edit } from 'lucide-react';

const ProfileHeader = ({ user, onEditClick }) => {
    return (
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
                <button 
                    className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600" 
                    onClick={onEditClick}
                >
                    <Edit size={16} />
                </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;