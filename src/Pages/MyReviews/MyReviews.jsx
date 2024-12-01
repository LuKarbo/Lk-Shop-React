import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Star, 
    Plus, 
    Search,
    Filter
} from 'lucide-react';

import { GamesAPI } from '../../BackEnd/API/GamesAPI';
import { ReviewApi } from '../../BackEnd/API/ReviewApi';
import { useAuth } from '../../BackEnd/Auth/AuthContext';

const MyReviews = () => {
    const [userGames, setUserGames] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewScore, setReviewScore] = useState(5);
    const { isLoggedIn } = useAuth();
    
    // New state for filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [scoreFilter, setScoreFilter] = useState('');

    const navigate = useNavigate();
    const userId = localStorage.getItem('user');
    const accessToken = localStorage.getItem('token');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const games = await GamesAPI.getUserGames(userId);
                setUserGames(games.data);

                const reviewsResponse = await ReviewApi.getById(userId, accessToken);
                if (reviewsResponse.success) {
                    setUserReviews(reviewsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId, accessToken, isLoggedIn, navigate]);

    const availableGamesForReview = userGames.filter(
        game => !userReviews.some(review => review.nombre_juego == game.game_name)
    );

    // Filtering logic
    const filteredReviews = useMemo(() => {
        return userReviews.filter(review => {
            const matchesSearch = 
                review.nombre_juego.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.contenido.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesScore = 
                scoreFilter === '' || 
                review.puntaje.toString() === scoreFilter;
            
            return matchesSearch && matchesScore;
        });
    }, [userReviews, searchTerm, scoreFilter]);

    const handleCreateReview = async () => {
        if (!selectedGame || !reviewContent) {
            alert('Por favor, selecciona un juego y escribe una reseña');
            return;
        }

        try {
            const response = await ReviewApi.createGroup(
                userId, 
                selectedGame.id_game, 
                reviewContent, 
                reviewScore, 
                accessToken
            );

            if (response.success) {
                const updatedReviews = await ReviewApi.getById(userId, accessToken);
                setUserReviews(updatedReviews.data);
                
                setIsCreateModalOpen(false);
                setSelectedGame(null);
                setReviewContent('');
                setReviewScore(5);
            }
        } catch (error) {
            console.error('Error creating review:', error);
        }
    };

    return (
        <div className="container mx-auto p-6 m-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <Star className="mr-2" /> Mis Reseñas
                </h1>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                    <Plus className="mr-2" /> Crear Reseña
                </button>
            </div>

            <div className="mb-6 flex space-x-4">
                <div className="relative flex-grow">
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre de juego o contenido"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border rounded-md"
                    />
                </div>

                <div className="relative">
                    <select
                        value={scoreFilter}
                        onChange={(e) => setScoreFilter(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="">Todos los puntajes</option>
                        {[1, 2, 3, 4, 5].map(score => (
                            <option key={score} value={score}>
                                {score} <Star size={16} className="inline" />
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredReviews.length === 0 ? (
                    <div className="text-center bg-gray-100 p-8 rounded-lg">
                        <p className="text-gray-600">
                            {userReviews.length === 0 
                                ? "Aún no has escrito ninguna reseña." 
                                : "No se encontraron reseñas que coincidan con tu búsqueda."}
                        </p>
                    </div>
                ) : (
                    filteredReviews.map(review => (
                        <div 
                            key={review.id_review} 
                            className="bg-white rounded-lg shadow-md p-4 flex justify-between items-start"
                        >
                            <div>
                                <div className="flex items-center mb-2">
                                    <h3 className="text-xl font-semibold mr-2">{review.nombre_juego}</h3>
                                    <span className="text-yellow-500 flex items-center">
                                        <Star className="mr-1" size={16} /> {review.puntaje}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">{review.contenido}</p>
                                <p className="text-sm text-gray-500">{new Date(review.fecha).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-2xl font-bold mb-4">Crear Nueva Reseña</h2>
                        
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Selecciona un Juego</label>
                            <select
                                value={selectedGame?.id_game || ''}
                                onChange={(e) => {
                                    const game = availableGamesForReview.find(
                                        g => g.id_game === parseInt(e.target.value)
                                    );
                                    setSelectedGame(game);
                                }}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Selecciona un juego</option>
                                {availableGamesForReview.map(game => (
                                    <option key={game.id_game} value={game.id_game}>
                                        {game.game_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Puntaje</label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map(score => (
                                    <Star 
                                        key={score} 
                                        size={24} 
                                        className={`cursor-pointer ${
                                            score <= reviewScore 
                                                ? 'text-yellow-500 fill-current' 
                                                : 'text-gray-300'
                                        }`}
                                        onClick={() => setReviewScore(score)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Reseña</label>
                            <textarea
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                className="w-full p-2 border rounded-md min-h-[100px]"
                                placeholder="Escribe tu reseña aquí..."
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button 
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleCreateReview}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Guardar Reseña
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReviews;