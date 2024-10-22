import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Product from '../Pages-Component/Product';
import './Products.css';

const Products = () => {
    // Estados para los filtros
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [publisher, setPublisher] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [onlyDiscounted, setOnlyDiscounted] = useState(false);
    const [filteredGames, setFilteredGames] = useState([]);

    const navigate = useNavigate();

    const games_list = [
        {
            id: 1,
            title: "The Last Journey",
            description: "Un épico juego de aventuras",
            size: "featured",
            price: "59.99",
            rating: 4.8,
            image: "https://via.placeholder.com/800x600",
            category: "Aventura",
            publisher: "EA",
            discounted: true
        },
        {
            id: 2,
            title: "Space Warriors",
            description: "Batalla espacial multijugador",
            size: "wide",
            price: "45.99",
            rating: 4.5,
            image: "https://via.placeholder.com/600x400",
            category: "Acción",
            publisher: "Ubisoft",
            discounted: false
        },
        {
            id: 3,
            title: "Mystic Lands",
            description: "Explora mundos mágicos llenos de enigmas",
            size: "regular",
            price: "39.99",
            rating: 4.6,
            image: "https://via.placeholder.com/640x480",
            category: "RPG",
            publisher: "Square Enix",
            discounted: true
        },
        {
            id: 4,
            title: "Racing Fever",
            description: "Compite en carreras al límite de la velocidad",
            size: "wide",
            price: "29.99",
            rating: 4.2,
            image: "https://via.placeholder.com/600x400",
            category: "Carreras",
            publisher: "Codemasters",
            discounted: false
        },
        {
            id: 5,
            title: "Zombie Mayhem",
            description: "Sobrevive al apocalipsis zombie",
            size: "featured",
            price: "49.99",
            rating: 4.4,
            image: "https://via.placeholder.com/800x600",
            category: "Acción",
            publisher: "Capcom",
            discounted: true
        },
        {
            id: 6,
            title: "Puzzle Quest",
            description: "Resuelve rompecabezas para avanzar niveles",
            size: "regular",
            price: "19.99",
            rating: 4.1,
            image: "https://via.placeholder.com/640x480",
            category: "Puzzle",
            publisher: "PopCap Games",
            discounted: true
        },
        {
            id: 7,
            title: "Virtual Farm",
            description: "Construye y gestiona tu propia granja virtual",
            size: "wide",
            price: "24.99",
            rating: 3.9,
            image: "https://via.placeholder.com/600x400",
            category: "Simulación",
            publisher: "Natsume",
            discounted: false
        },
        {
            id: 8,
            title: "Horror Nights",
            description: "Un juego de terror que pondrá tus nervios al límite",
            size: "featured",
            price: "54.99",
            rating: 4.7,
            image: "https://via.placeholder.com/800x600",
            category: "Terror",
            publisher: "Bloober Team",
            discounted: false
        }
    ];
    

    // Aplicar los filtros
    const applyFilters = () => {

        // Limpiar la búsqueda anterior
        setFilteredGames([]);
        
        // nuevos filtros
        const newFilteredGames = games_list.filter(game => {
            // título o descripción
            const searchMatch = !search || 
                game.title.toLowerCase().includes(search.toLowerCase()) ||
                game.description.toLowerCase().includes(search.toLowerCase());

            // categoría
            const categoryMatch = !category || game.category === category;

            // editor
            const publisherMatch = !publisher || game.publisher === publisher;

            // precio máximo
            const priceMatch = !maxPrice || parseFloat(game.price) <= parseFloat(maxPrice);

            // descuento
            const discountMatch = !onlyDiscounted || game.discounted;

            return searchMatch && categoryMatch && publisherMatch && priceMatch && discountMatch;
        });

        // Actualizar con los nuevos filtros
        setFilteredGames(newFilteredGames);
    };

    // Aplicar los filtros cuando cambie cualquiera
    useEffect(() => {
        applyFilters();
    }, [search, category, publisher, maxPrice, onlyDiscounted]);

    const handleBuy = (game) => {
        console.log('Comprando:', game.title);
    };
    
    const handleFavorite = (game) => {
        console.log('Añadiendo a favoritos:', game.title);
    };

    const handleGoGame = (id) => {
        navigate('/');
        console.log('Ver data de: ', id)
    }

    // Limpiar filtros
    const handleClearFilters = () => {
        setSearch('');
        setCategory('');
        setPublisher('');
        setMaxPrice('');
        setOnlyDiscounted(false);
    };

    return (
        <div className="products-container min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto">
                <div className="search-bar p-4">
                    <input 
                        type="text" 
                        placeholder="Buscar juegos..." 
                        className="w-full p-2 rounded-lg bg-gray-700 text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filters flex flex-wrap gap-4 p-4">
                    <select 
                        className="p-2 rounded-lg bg-gray-700 text-white"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        <option value="Aventura">Aventura</option>
                        <option value="RPG">RPG</option>
                        <option value="Acción">Acción</option>
                    </select>

                    <select 
                        className="p-2 rounded-lg bg-gray-700 text-white"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                    >
                        <option value="">Todos los editores</option>
                        <option value="Ubisoft">Ubisoft</option>
                        <option value="EA">EA</option>
                        <option value="Nintendo">Nintendo</option>
                    </select>

                    <input 
                        type="number" 
                        className="p-2 rounded-lg bg-gray-700 text-white" 
                        placeholder="Precio máximo"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    
                    <label className="flex items-center text-white">
                        <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={onlyDiscounted}
                            onChange={(e) => setOnlyDiscounted(e.target.checked)}
                        />
                        Con descuento
                    </label>

                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>

                {filteredGames.length === 0 ? (
                    <div className="text-white text-center py-8">
                        No se encontraron juegos que coincidan con los filtros seleccionados.
                    </div>
                ) : (
                    <Product
                        games={filteredGames}
                        onBuy={handleBuy}
                        onFavorite={handleFavorite}
                        goGame={handleGoGame}
                    />
                )}
            </div>
        </div>
    );
};

export default Products;