import { useState } from 'react';
import { Check, X } from 'lucide-react';

const EditProfile = ({ user, onSave, onClose }) => {
    const [profileImage, setProfileImage] = useState(user.profileIMG || "https://via.placeholder.com/150x150");
    const [bannerImage, setBannerImage] = useState(user.profileBanner || "https://via.placeholder.com/2100x300");
    const [name, setName] = useState(user.nombre);
    const [bio, setBio] = useState(user.bio);
    const [profileImageUrl, setProfileImageUrl] = useState(user.profileIMG || "");
    const [bannerImageUrl, setBannerImageUrl] = useState(user.profileBanner || "");

    const handleSaveProfile = async () => {
        try {
            onSave({
                profileImage: profileImageUrl || profileImage,
                bannerImage: bannerImageUrl || bannerImage,
                name,
                bio
            });
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancelEdit = () => {
        setProfileImage(user.profileIMG || "https://via.placeholder.com/150x150");
        setBannerImage(user.profileBanner || "https://via.placeholder.com/2100x300");
        setProfileImageUrl("");
        setBannerImageUrl("");
        setName(user.nombre);
        setBio(user.bio);
        onClose();
    };

    const handleProfileImageUrlChange = (e) => {
        const url = e.target.value;
        setProfileImageUrl(url);
        setProfileImage(url || "https://via.placeholder.com/150x150");
    };

    const handleBannerImageUrlChange = (e) => {
        const url = e.target.value;
        setBannerImageUrl(url);
        setBannerImage(url || "https://via.placeholder.com/2100x300");
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto my-4 sm:my-8 md:my-12 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Editar Perfil</h2>
            
            <div className="mb-4 sm:mb-6">
                <label htmlFor="banner" className="block font-medium mb-2 text-sm sm:text-base">
                    Banner Image URL
                </label>
                <input
                    id="banner-url"
                    type="text"
                    value={bannerImageUrl}
                    onChange={handleBannerImageUrlChange}
                    placeholder="Enter banner image URL"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-4"
                />
                <div className="relative w-full">
                    <img
                        src={bannerImage}
                        alt="Banner"
                        className="w-full h-24 sm:h-40 object-cover rounded-lg"
                    />
                </div>
            </div>

            <div className="mb-4 sm:mb-6">
                <label htmlFor="profile" className="block font-medium mb-2 text-sm sm:text-base">
                    Avatar Image URL
                </label>
                <input
                    id="profile-url"
                    type="text"
                    value={profileImageUrl}
                    onChange={handleProfileImageUrlChange}
                    placeholder="Enter avatar image URL"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-4"
                />
                <div className="relative flex justify-center">
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-full"
                    />
                </div>
            </div>

            <div className="mb-4 sm:mb-6">
                <label htmlFor="name" className="block font-medium mb-2 text-sm sm:text-base">
                    Nombre
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4 sm:mb-8">
                <label htmlFor="bio" className="block font-medium mb-2 text-sm sm:text-base">
                    Descripción
                </label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    onClick={handleCancelEdit}
                >
                    <X size={16} className="inline-block mr-2" /> Cancelar
                </button>
                <button
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    onClick={handleSaveProfile}
                >
                    <Check size={16} className="inline-block mr-2" /> Guardar
                </button>
            </div>
        </div>
    );
};

export default EditProfile;