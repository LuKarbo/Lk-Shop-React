import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Pagination } from '../Functions/Pagination';
import { ReviewApi } from '../../../../BackEnd/API/ReviewAPI';

const ReviewsTable = () => {
    const [reviews, setReviews] = useState([]);
    const [reviewSearch, setReviewSearch] = useState('');
    const [reviewPage, setReviewPage] = useState(1);
    const [sortBy, setSortBy] = useState('nombre_juego');
    const [sortOrder, setSortOrder] = useState('asc');
    
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const accessToken = localStorage.getItem('token');
                const reviewsResponse = await ReviewApi.getAll(accessToken);
                setReviews(reviewsResponse.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
    }, []);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const filteredReviews = reviews.filter(review =>
        review.nombre_juego.toLowerCase().includes(reviewSearch.toLowerCase())
    ).sort((a, b) => {
        const compareValue = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'puntaje') {
            return (a.puntaje - b.puntaje) * compareValue;
        }
        return a[sortBy].localeCompare(b[sortBy]) * compareValue;
    });

    const paginatedReviews = filteredReviews.slice(
        (reviewPage - 1) * ITEMS_PER_PAGE,
        reviewPage * ITEMS_PER_PAGE
    );

    return (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Reseñas</h3>
                <input
                    type="text"
                    placeholder="Buscar por nombre de juego..."
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-gray-600">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-gray-600 cursor-pointer"
                                    onClick={() => handleSort('nombre_juego')}>
                                    Juego
                                </th>
                                <th className="px-6 py-3 text-left text-gray-600 cursor-pointer"
                                    onClick={() => handleSort('puntaje')}>
                                    Puntaje
                                </th>
                                <th className="px-6 py-3 text-left text-gray-600">
                                    Contenido
                                </th>
                                <th className="px-6 py-3 text-left text-gray-600 cursor-pointer"
                                    onClick={() => handleSort('fecha')}>
                                    Fecha
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedReviews.map((review) => (
                                <tr key={review.id_review} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{review.id_review}</td>
                                    <td className="px-6 py-4">{review.nombre_juego}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <Star className="w-5 h-5 text-yellow-400 inline" />
                                            <span className="ml-1">{review.puntaje}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{review.contenido}</td>
                                    <td className="px-6 py-4">
                                        {new Date(review.fecha).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={reviewPage}
                    totalItems={filteredReviews.length}
                    setPage={setReviewPage}
                    ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                />
            </div>
        </div>
    );
};

export default ReviewsTable;