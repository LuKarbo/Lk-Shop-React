import { useState } from 'react';
import { Image as ImageIcon, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

const GamesManagement = () => {
    const [isViewReviewOpen, setIsViewReviewOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [gameSearch, setGameSearch] = useState('');
    const [reviewSearch, setReviewSearch] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const [gamePage, setGamePage] = useState(1);
    const [reviewPage, setReviewPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        publisher: '',
        discounted: false,
        originalPrice: ''
    });

    const games = [
        {
            id: 1,
            title: "The Last Journey",
            description: "Un épico juego de aventuras que te llevará a través de mundos inexplorados",
            price: "59.99",
            rating: 4.8,
            image: "https://via.placeholder.com/800x600",
            category: "Aventura",
            publisher: "EA",
            discounted: true,
            originalPrice: "79.99"
        }
    ];

    const reviews = [
        {
            id: 1,
            userName: 'Juan Pérez',
            gameTitle: 'The Last Journey',
            rating: 4,
            date: '2024-03-20',
            content: 'Excelente juego, muy divertido y adictivo'
        },
        {
            id: 2,
            userName: 'María López',
            gameTitle: 'The Last Journey',
            rating: 5,
            date: '2024-03-19',
            content: 'Uno de los mejores juegos que he jugado'
        }
    ];

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setGamePage(1);
    };

    const sortItems = (itemsToSort) => {
        if (!sortConfig.key) return itemsToSort;

        return [...itemsToSort].sort((a, b) => {
            if (a[sortConfig.key] === null) return 1;
            if (b[sortConfig.key] === null) return -1;

            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredGames = sortItems(
        games.filter(game => 
            game.title.toLowerCase().includes(gameSearch.toLowerCase()) ||
            game.publisher.toLowerCase().includes(gameSearch.toLowerCase()) ||
            game.category.toLowerCase().includes(gameSearch.toLowerCase())
        )
    );

    const filteredReviews = sortItems(
        reviews.filter(review =>
            review.gameTitle.toLowerCase().includes(reviewSearch.toLowerCase()) ||
            review.userName.toLowerCase().includes(reviewSearch.toLowerCase())
        )
    );

    const SortIndicator = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronUp className="opacity-0 group-hover:opacity-50 w-4 h-4 inline-block ml-1" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ChevronUp className="w-4 h-4 inline-block ml-1 text-blue-500" />
            : <ChevronDown className="w-4 h-4 inline-block ml-1 text-blue-500" />;
    };

    const SortableHeader = ({ column, label }) => (
        <th 
            className="px-6 py-3 text-left text-gray-600 cursor-pointer group hover:bg-gray-100"
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center">
                {label}
                <SortIndicator columnKey={column} />
            </div>
        </th>
    );

    const handleOpenEditModal = (game) => {
        setSelectedGame(game);
        setEditForm({
            title: game.title,
            description: game.description,
            price: game.price,
            category: game.category,
            publisher: game.publisher,
            discounted: game.discounted,
            originalPrice: game.originalPrice
        });
        setIsEditModalOpen(true);
    };
    
    const handleOpenDeleteModal = (game) => {
        setSelectedGame(game);
        setIsDeleteModalOpen(true);
    };
    
    const handleEditSubmit = () => {
        console.log('Juego editado:', { ...selectedGame, ...editForm });
        setIsEditModalOpen(false);
    };
    
    const handleDeleteSubmit = () => {
        console.log('Juego eliminado:', selectedGame);
        setIsDeleteModalOpen(false);
    };

    const handleOpenViewReview = (review) => {
        setSelectedReview(review);
        setIsViewReviewOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setEditForm({
                    ...editForm,
                    image: file
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const Pagination = ({ currentPage, totalItems, setPage }) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
                <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                        Mostrando{' '}
                        <span className="font-medium">
                            {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)}
                        </span>
                        {' '}a{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                        </span>
                        {' '}de{' '}
                        <span className="font-medium">{totalItems}</span>
                        {' '}resultados
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                            currentPage === 1
                            ? 'text-gray-400 bg-gray-100'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                            currentPage === totalPages
                            ? 'text-gray-400 bg-gray-100'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };
    
    const paginatedGames = filteredGames.slice(
        (gamePage - 1) * ITEMS_PER_PAGE,
        gamePage * ITEMS_PER_PAGE
    );

    const paginatedReviews = filteredReviews.slice(
        (reviewPage - 1) * ITEMS_PER_PAGE,
        reviewPage * ITEMS_PER_PAGE
    );

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-6 sectionTitle">Gestión de Juegos</h2>

            {/* Lista de Juegos */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Juegos</h3>
                    <input
                        type="text"
                        placeholder="Buscar juegos..."
                        value={gameSearch}
                        onChange={(e) => setGameSearch(e.target.value)}
                        className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-600">ID</th>
                                    <SortableHeader column="title" label="Título" />
                                    <SortableHeader column="description" label="Descripción" />
                                    <SortableHeader column="price" label="Precio" />
                                    <SortableHeader column="rating" label="Valoración" />
                                    <SortableHeader column="category" label="Categoría" />
                                    <SortableHeader column="publisher" label="Editorial" />
                                    <th className="px-6 py-3 text-left text-gray-600">Descuento</th>
                                    <th className="px-6 py-3 text-left text-gray-600">Precio Original</th>
                                    <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedGames.map((game) => (
                                    <tr key={game.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{game.id}</td>
                                        <td className="px-6 py-4">{game.title}</td>
                                        <td className="px-6 py-4">{game.description}</td>
                                        <td className="px-6 py-4">${game.price}</td>
                                        <td className="px-6 py-4">{game.rating}/5</td>
                                        <td className="px-6 py-4">{game.category}</td>
                                        <td className="px-6 py-4">{game.publisher}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                game.discounted 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {game.discounted ? 'Sí' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">${game.originalPrice}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(game)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Pencil size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDeleteModal(game)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={gamePage}
                        totalItems={filteredGames.length}
                        setPage={setGamePage}
                    />
                </div>
            </div>

            {/* Lista de Reseñas */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Reseñas</h3>
                    <input
                        type="text"
                        placeholder="Buscar reseñas..."
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
                                    <th className="px-6 py-3 text-left text-gray-600">ID</th>
                                    <SortableHeader column="userName" label="Usuario" />
                                    <SortableHeader column="gameTitle" label="Juego" />
                                    <SortableHeader column="rating" label="Valoración" />
                                    <SortableHeader column="date" label="Fecha" />
                                    <th className="px-6 py-3 text-left text-gray-600">Contenido</th>
                                    <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedReviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{review.id}</td>
                                        <td className="px-6 py-4">{review.userName}</td>
                                        <td className="px-6 py-4">{review.gameTitle}</td>
                                        <td className="px-6 py-4">{review.rating}/5</td>
                                        <td className="px-6 py-4">{review.date}</td>
                                        <td className="px-6 py-4 truncate max-w-xs">{review.content}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleOpenViewReview(review)}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                            >
                                                Ver
                                            </button>
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
                    />
                </div>
            </div>

            {/* Modal de Edición */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                        <h3 className="text-xl font-semibold mb-4">Editar Juego</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleEditSubmit();
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Imagen del Juego
                                    </label>
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-600 transition-colors"
                                        onClick={() => document.getElementById('editImageInput').click()}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-contain rounded-lg"
                                            />
                                        ) : selectedGame?.image ? (
                                            <img
                                                src={selectedGame.image}
                                                alt="Imagen actual"
                                                className="w-full h-48 object-contain rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                                                <ImageIcon size={48} />
                                                <span className="text-sm">Click para subir imagen</span>
                                            </div>
                                        )}
                                        <input
                                            id="editImageInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Editorial
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.publisher}
                                        onChange={(e) => setEditForm({...editForm, publisher: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={editForm.discounted}
                                            onChange={(e) => setEditForm({...editForm, discounted: e.target.checked})}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">En descuento</span>
                                    </label>
                                </div>
                                {editForm.discounted && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Precio Original
                                        </label>
                                        <input
                                            type="number"
                                            value={editForm.originalPrice}
                                            onChange={(e) => setEditForm({...editForm, originalPrice: e.target.value})}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setImagePreview(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Eliminación */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Confirmar Eliminación</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro que desea eliminar el juego `{selectedGame?.title}`? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteSubmit}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Ver Reseña */}
            {isViewReviewOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                        <h3 className="text-xl font-semibold mb-4">Detalles de la Reseña</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="font-medium">Usuario:</span> {selectedReview?.userName}
                            </div>
                            <div>
                                <span className="font-medium">Juego:</span> {selectedReview?.gameTitle}
                            </div>
                            <div>
                                <span className="font-medium">Valoración:</span> {selectedReview?.rating}/5
                            </div>
                            <div>
                                <span className="font-medium">Fecha:</span> {selectedReview?.date}
                            </div>
                            <div>
                                <span className="font-medium">Contenido:</span>
                                <p className="mt-1 text-gray-600">{selectedReview?.content}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsViewReviewOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamesManagement;