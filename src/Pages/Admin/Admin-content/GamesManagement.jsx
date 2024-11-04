import { useState } from 'react';
import { games_list } from '../../../BackEnd/Data/games';
import { discountCodes } from '../../../BackEnd/Data/discountCodes';
import { reviews } from '../../../BackEnd/Data/reviews';
import { Pagination } from './Functions/Pagination';
import { Image as ImageIcon, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const GamesManagement = () => {
    //#region Juegos estados, handlers y lista
    const [gameSearch, setGameSearch] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        publisher: '',
        discounted: false,
        selectedDiscountId: '',
        copies: 0
    });
    const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
    const [newGameForm, setNewGameForm] = useState({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        publisher: '',
        discounted: false,
        selectedDiscountId: '',
        copies: 0,
        image: null
    });

    const handleOpenEditModal = (game) => {
        setSelectedGame(game);
        setEditForm({
            title: game.title,
            description: game.description,
            price: game.price,
            category: game.category,
            publisher: game.publisher,
            discounted: game.discounted,
            originalPrice: game.originalPrice,
            selectedDiscountId: game.discountId || '',
            copies: game.copies
        });
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (game) => {
        setSelectedGame(game);
        setIsDeleteModalOpen(true);
    };

    const handleEditSubmit = () => {
        const updatedGame = {
            ...selectedGame,
            ...editForm,
            discountId: editForm.selectedDiscountId || null
        };
        console.log('Juego editado:', updatedGame);
        setIsEditModalOpen(false);
    };
    
    const handleDeleteSubmit = () => {
        console.log('Juego eliminado:', selectedGame);
        setIsDeleteModalOpen(false);
    };

    const handleAddGameSubmit = () => {
        const newGame = {
            ...newGameForm,
            discountId: newGameForm.selectedDiscountId || null
        };
        console.log('Nuevo juego creado:', newGame);
        setIsAddGameModalOpen(false);
        setNewGameForm({
            title: '',
            description: '',
            price: '',
            originalPrice: '',
            category: '',
            publisher: '',
            discounted: false,
            selectedDiscountId: '',
            copies: 0,
            image: null
        });
    };

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setEditForm(prev => ({
            ...prev,
            originalPrice: newPrice,
            price: prev.selectedDiscountId ? 
                calculateDiscountedPrice(newPrice, prev.selectedDiscountId) : 
                newPrice
        }));
    };

    const handleDiscountChange = (e) => {
        const discountId = e.target.value;
        setEditForm(prev => ({
            ...prev,
            selectedDiscountId: discountId,
            discounted: discountId !== '',
            price: discountId ? 
                calculateDiscountedPrice(prev.originalPrice, discountId) : 
                prev.originalPrice
        }));
    };

    //#endregion

    //#region Descuentos estados, handlers y lista
    const [discountPage, setDiscountPage] = useState(1);
    const [discountSearch, setDiscountSearch] = useState('');
    const [isEditDiscountModalOpen, setIsEditDiscountModalOpen] = useState(false);
    const [isDeleteDiscountModalOpen, setIsDeleteDiscountModalOpen] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [editDiscountForm, setEditDiscountForm] = useState({
        code: '',
        endDate: '',
        discountPercentage: ''
    });
    const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);
    const [newDiscountForm, setNewDiscountForm] = useState({
        code: '',
        discountPercentage: '',
        endDate: ''
    });

    const activeDiscounts = discountCodes.filter(discount => discount.status === 'Activo');

    const handleOpenEditDiscountModal = (discount) => {
        setSelectedDiscount(discount);
        setEditDiscountForm({
            code: discount.code,
            endDate: discount.endDate,
            discountPercentage: discount.discountPercentage
        });
        setIsEditDiscountModalOpen(true);
    };

    const handleOpenDeleteDiscountModal = (discount) => {
        setSelectedDiscount(discount);
        setIsDeleteDiscountModalOpen(true);
    };

    const handleEditDiscountSubmit = () => {
        console.log('Descuento editado:', { ...selectedDiscount, ...editDiscountForm });
        setIsEditDiscountModalOpen(false);
    };

    const handleDeleteDiscountSubmit = () => {
        console.log('Descuento eliminado:', selectedDiscount);
        setIsDeleteDiscountModalOpen(false);
    };

    const handleAddDiscountSubmit = () => {
        console.log('Nuevo descuento creado:', newDiscountForm);
        setIsAddDiscountModalOpen(false);
        setNewDiscountForm({
            code: '',
            discountPercentage: '',
            endDate: ''
        });
    };

    const calculateDiscountedPrice = (originalPrice, discountId) => {
        const discount = discountCodes.find(d => d.id === parseInt(discountId));
        if (discount) {
            const discountAmount = (parseFloat(originalPrice) * discount.discountPercentage) / 100;
            return (parseFloat(originalPrice) - discountAmount).toFixed(2);
        }
        return originalPrice;
    };

    const getDiscountInfo = (discountId) => {
        const discount = discountCodes.find(d => d.id === parseInt(discountId));
        return discount ? `${discount.code} (${discount.discountPercentage}%)` : 'Sin descuento';
    };

    //#endregion

    //#region Reseñas estados, handlers y lista
    const [isViewReviewOpen, setIsViewReviewOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [reviewSearch, setReviewSearch] = useState('');

    const handleOpenViewReview = (review) => {
        setSelectedReview(review);
        setIsViewReviewOpen(true);
    };

    //#endregion

    //#region Funciones, Filtros y Ordenadores
        const [sortConfig, setSortConfig] = useState({
            key: null,
            direction: 'asc'
        });
        const [gamePage, setGamePage] = useState(1);
        const [reviewPage, setReviewPage] = useState(1);
        const ITEMS_PER_PAGE = 6;

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

        const handleSort = (key) => {
            let direction = 'asc';
            if (sortConfig.key === key && sortConfig.direction === 'asc') {
                direction = 'desc';
            }
            setSortConfig({ key, direction });
            setGamePage(1);
        };

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

        const getStatusColor = (status) => {
            switch (status) {
                case 'Activo':
                    return 'bg-green-100 text-green-800';
                case 'Caducado':
                    return 'bg-red-100 text-red-800';
                case 'Espera':
                    return 'bg-yellow-100 text-yellow-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        };

        //#region Filtros de lista
        const filteredGames = sortItems(
            games_list.filter(game => 
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

        const filteredDiscountCodes = sortItems(
            discountCodes.filter(discount =>
                discount.code.toLowerCase().includes(discountSearch.toLowerCase())
            )
        );
        //#endregion

    //#endregion

    //#region Imagen PreView
    const [imagePreview, setImagePreview] = useState(null);

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
    //#endregion

    //#region Paginado Funciones
    const paginatedGames = filteredGames.slice(
        (gamePage - 1) * ITEMS_PER_PAGE,
        gamePage * ITEMS_PER_PAGE
    );

    const paginatedReviews = filteredReviews.slice(
        (reviewPage - 1) * ITEMS_PER_PAGE,
        reviewPage * ITEMS_PER_PAGE
    );

    const paginatedDiscountCodes = filteredDiscountCodes.slice(
        (discountPage - 1) * ITEMS_PER_PAGE,
        discountPage * ITEMS_PER_PAGE
    );

    //#endregion

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-6 sectionTitle">Gestión de Juegos</h2>

            {/* Lista de Juegos */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-semibold">Juegos</h3>
                        <button
                            onClick={() => setIsAddGameModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Juego Nuevo
                        </button>
                    </div>
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
                                    <SortableHeader column="price" label="Precio" />
                                    <SortableHeader column="originalPrice" label="Precio Original" />
                                    <SortableHeader column="rating" label="Valoración" />
                                    <SortableHeader column="category" label="Categoría" />
                                    <SortableHeader column="publisher" label="Editorial" />
                                    <SortableHeader column="copies" label="Cantidad de Copias" />
                                    <th className="px-6 py-3 text-left text-gray-600">Descuento Aplicado</th>
                                    <th className="px-6 py-3 text-left text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedGames.map((game) => (
                                    <tr key={game.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{game.id}</td>
                                        <td className="px-6 py-4">{game.title}</td>
                                        <td className="px-6 py-4">${game.price}</td>
                                        <td className="px-6 py-4">${game.originalPrice}</td>
                                        <td className="px-6 py-4">{game.rating}/5</td>
                                        <td className="px-6 py-4">{game.category}</td>
                                        <td className="px-6 py-4">{game.publisher}</td>
                                        <td className="px-6 py-4">{game.copies}</td>
                                        <td className="px-6 py-4">
                                            {game.discountId ? (
                                                <span className="px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    {getDiscountInfo(game.discountId)}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                    Sin descuento
                                                </span>
                                            )}
                                        </td>
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
                        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    />
                </div>
            </div>

            {/* Lista de Descuentos */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-semibold">Códigos de Descuento</h3>
                        <button
                            onClick={() => setIsAddDiscountModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Descuento Nuevo
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar códigos..."
                        value={discountSearch}
                        onChange={(e) => setDiscountSearch(e.target.value)}
                        className="px-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-600">ID</th>
                                    <SortableHeader column="code" label="Código" />
                                    <SortableHeader column="createdAt" label="Fecha Creación" />
                                    <SortableHeader column="discountPercentage" label="% de Descuento" />
                                    <SortableHeader column="endDate" label="Fecha de Finalización" />
                                    <SortableHeader column="status" label="Status" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedDiscountCodes.map((discount) => (
                                    <tr key={discount.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{discount.id}</td>
                                    <td className="px-6 py-4">{discount.code}</td>
                                    <td className="px-6 py-4">{discount.createdAt}</td>
                                    <td className="px-6 py-4">{discount.discountPercentage}%</td>
                                    <td className="px-6 py-4">{discount.endDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(discount.status)}`}>
                                            {discount.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleOpenEditDiscountModal(discount)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Pencil size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteDiscountModal(discount)}
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
                        currentPage={discountPage}
                        totalItems={filteredDiscountCodes.length}
                        setPage={setDiscountPage}
                        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
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
                        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
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
                                        Precio Original
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.originalPrice}
                                        onChange={handlePriceChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descuento Aplicable
                                    </label>
                                    <select
                                        value={editForm.selectedDiscountId}
                                        onChange={handleDiscountChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sin descuento</option>
                                        {activeDiscounts.map(discount => (
                                            <option key={discount.id} value={discount.id}>
                                                {discount.code} ({discount.discountPercentage}% off)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio Final
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.price}
                                        readOnly
                                        className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cantidad de Copias
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.copies}
                                        onChange={(e) => setEditForm({...editForm, copies: parseInt(e.target.value)})}
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

            {/* Modal de Edición de Descuento */}
            {isEditDiscountModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Editar Código de Descuento</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleEditDiscountSubmit();
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Código
                                    </label>
                                    <input
                                        type="text"
                                        value={editDiscountForm.code}
                                        onChange={(e) => setEditDiscountForm({...editDiscountForm, code: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Porcentaje de Descuento
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={editDiscountForm.discountPercentage}
                                        onChange={(e) => setEditDiscountForm({...editDiscountForm, discountPercentage: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Finalización
                                    </label>
                                    <input
                                        type="date"
                                        value={editDiscountForm.endDate}
                                        onChange={(e) => setEditDiscountForm({...editDiscountForm, endDate: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditDiscountModalOpen(false)}
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

            {/* Modal de Eliminación de Descuento */}
            {isDeleteDiscountModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Confirmar Eliminación</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro que desea eliminar el código de descuento `{selectedDiscount?.code}`? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteDiscountModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteDiscountSubmit}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Agregar Juego */}
            {isAddGameModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                        <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Juego</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddGameSubmit();
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={newGameForm.title}
                                        onChange={(e) => setNewGameForm({...newGameForm, title: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio Original
                                    </label>
                                    <input
                                        type="number"
                                        value={newGameForm.originalPrice}
                                        onChange={(e) => {
                                            const newPrice = e.target.value;
                                            setNewGameForm({
                                                ...newGameForm,
                                                originalPrice: newPrice,
                                                price: newGameForm.selectedDiscountId ? 
                                                    calculateDiscountedPrice(newPrice, newGameForm.selectedDiscountId) : 
                                                    newPrice
                                            });
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descuento Aplicable
                                    </label>
                                    <select
                                        value={newGameForm.selectedDiscountId}
                                        onChange={(e) => {
                                            const discountId = e.target.value;
                                            setNewGameForm({
                                                ...newGameForm,
                                                selectedDiscountId: discountId,
                                                discounted: discountId !== '',
                                                price: discountId ? 
                                                    calculateDiscountedPrice(newGameForm.originalPrice, discountId) : 
                                                    newGameForm.originalPrice
                                            });
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sin descuento</option>
                                        {activeDiscounts.map(discount => (
                                            <option key={discount.id} value={discount.id}>
                                                {discount.code} ({discount.discountPercentage}% off)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio Final
                                    </label>
                                    <input
                                        type="number"
                                        value={newGameForm.price}
                                        readOnly
                                        className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cantidad de Copias
                                    </label>
                                    <input
                                        type="number"
                                        value={newGameForm.copies}
                                        onChange={(e) => setNewGameForm({...newGameForm, copies: parseInt(e.target.value)})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={newGameForm.description}
                                        onChange={(e) => setNewGameForm({...newGameForm, description: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>
                                    <input
                                        type="text"
                                        value={newGameForm.category}
                                        onChange={(e) => setNewGameForm({...newGameForm, category: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Editorial
                                    </label>
                                    <input
                                        type="text"
                                        value={newGameForm.publisher}
                                        onChange={(e) => setNewGameForm({...newGameForm, publisher: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddGameModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Crear Juego
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Agregar Descuento */}
            {isAddDiscountModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Descuento</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddDiscountSubmit();
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Código
                                    </label>
                                    <input
                                        type="text"
                                        value={newDiscountForm.code}
                                        onChange={(e) => setNewDiscountForm({...newDiscountForm, code: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Porcentaje de Descuento
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={newDiscountForm.discountPercentage}
                                        onChange={(e) => setNewDiscountForm({...newDiscountForm, discountPercentage: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Finalización
                                    </label>
                                    <input
                                        type="date"
                                        value={newDiscountForm.endDate}
                                        onChange={(e) => setNewDiscountForm({...newDiscountForm, endDate: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddDiscountModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Crear Descuento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamesManagement;