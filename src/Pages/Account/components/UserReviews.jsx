import { Star } from 'lucide-react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const UserReviews = ({ reviews, onViewAll }) => {
    const hasReviews = reviews && reviews.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Latest Reviews</h2>
                {hasReviews && (
                    <button className="text-blue-500 hover:text-blue-600" onClick={onViewAll}>
                        Ver Todas
                    </button>
                )}
            </div>
            
            {!hasReviews ? (
                <div className="text-center py-8 text-gray-500">
                    Aún no ha escrito ninguna reseña
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.slice(0, 3).map(review => (
                        <ReviewItem key={review.id_review} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
};

const ReviewItem = ({ review }) => (
    <div className="p-4 hover:bg-gray-50 rounded-lg transition">
        <div className="flex items-center space-x-4">
            <div className="flex-1">
                <div className="flex justify-between">
                    <h3 className="font-semibold">{review.nombre_juego}</h3>
                    <div className="flex items-center">
                        {[...Array(review.puntaje)].map((_, i) => (
                            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{formatDate(review.fecha)}</p>
            </div>
        </div>
        <p className="mt-2 text-gray-700">{review.contenido}</p>
    </div>
);

export default UserReviews;