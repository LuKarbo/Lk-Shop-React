import { useState } from 'react';
import { Camera, Upload, Check, X } from 'lucide-react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';

const EditProfile = ({ user, onSave, onClose }) => {
    const { updateUserProfile } = useAuth();
    const [profileImage, setProfileImage] = useState(user.profileImage);
    const [bannerImage, setBannerImage] = useState(user.bannerImage);
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio);

    const handleSaveProfile = async () => {
        try {
            await updateUserProfile({
                profileImage,
                bannerImage,
                name,
                bio
            });
            onSave({
                profileImage,
                bannerImage,
                name,
                bio
            });
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleCancelEdit = () => {
        setProfileImage(user.profileImage);
        setBannerImage(user.bannerImage);
        setName(user.name);
        setBio(user.bio);
        onClose();
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>
            <div className="mb-6">
                <label htmlFor="banner" className="block font-medium mb-2">
                    Banner
                </label>
                <div className="relative">
                    <img
                        src={bannerImage}
                        alt="Banner"
                        className="w-full h-40 object-cover rounded-lg"
                    />
                    <label
                        htmlFor="banner-upload"
                        className="absolute bottom-3 right-3 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 cursor-pointer"
                    >
                        <Upload size={16} />
                        <input
                            id="banner-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) => setBannerImage(URL.createObjectURL(e.target.files[0]))}
                        />
                    </label>
                </div>
            </div>
            <div className="mb-6">
                <label htmlFor="profile" className="block font-medium mb-2">
                    Avatar
                </label>
                <div className="relative">
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-28 h-28 object-cover rounded-full"
                    />
                    <label
                            htmlFor="profile-upload"
                            style={{ marginRight: '270px' }}
                            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 cursor-pointer"
                        >
                        <Camera size={16} />
                        <input
                            id="profile-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) => setProfileImage(URL.createObjectURL(e.target.files[0]))}
                        />
                    </label>
                </div>
            </div>
            <div className="mb-6">
                <label htmlFor="name" className="block font-medium mb-2">
                    Nombre
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-8">
                <label htmlFor="bio" className="block font-medium mb-2">
                    Descripción
                </label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={handleCancelEdit}
                >
                    <X size={16} className="inline-block mr-2" /> Cancelar
                </button>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={handleSaveProfile}
                >
                    <Check size={16} className="inline-block mr-2" /> Guardar
                </button>
            </div>
        </div>
    );
};

export default EditProfile;