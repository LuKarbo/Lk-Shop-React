import { useState } from 'react';
import Product from '../Pages-Component/Product';
import './Products.css';

const Products = () => {
    const [search, setSearch] = useState('');

    const games_list = [
        {
            id: 1,
            title: "The Last Journey",
            description: "Un épico juego de aventuras",
            size: "featured",
            price: "$59.99",
            rating: 4.8,
            image: "https://via.placeholder.com/800x600"
        },
        {
            id: 2,
            title: "Space Warriors",
            description: "Batalla espacial multijugador",
            size: "wide",
            price: "$45.99",
            rating: 4.5,
            image: "https://via.placeholder.com/600x400"
        },
        {
            id: 3,
            title: "Pixel Dreams",
            description: "Aventura retro",
            size: "tall",
            price: "$19.99",
            rating: 4.2,
            image: "https://via.placeholder.com/400x600"
        },
        {
            id: 4,
            title: "Racing Elite",
            description: "Carreras de alta velocidad",
            size: "normal",
            price: "$39.99",
            rating: 4.6,
            image: "https://via.placeholder.com/400x400"
        },
        {
            id: 2,
            title: "Space Warriors",
            description: "Batalla espacial multijugador",
            size: "wide",
            price: "$45.99",
            rating: 4.5,
            image: "https://via.placeholder.com/600x400"
        },
        {
            id: 3,
            title: "Pixel Dreams",
            description: "Aventura retro",
            size: "tall",
            price: "$19.99",
            rating: 4.2,
            image: "https://via.placeholder.com/400x600"
        },
        {
            id: 4,
            title: "Racing Elite",
            description: "Carreras de alta velocidad",
            size: "normal",
            price: "$39.99",
            rating: 4.6,
            image: "https://via.placeholder.com/400x400"
        },
        {
            id: 2,
            title: "Space Warriors",
            description: "Batalla espacial multijugador",
            size: "wide",
            price: "$45.99",
            rating: 4.5,
            image: "https://via.placeholder.com/600x400"
        },
        {
            id: 3,
            title: "Pixel Dreams",
            description: "Aventura retro",
            size: "tall",
            price: "$19.99",
            rating: 4.2,
            image: "https://via.placeholder.com/400x600"
        },
        {
            id: 4,
            title: "Racing Elite",
            description: "Carreras de alta velocidad",
            size: "normal",
            price: "$39.99",
            rating: 4.6,
            image: "https://via.placeholder.com/400x400"
        }
    ];

    const handleBuy = (game) => {
        console.log('Comprando:', game.title);
    };
    
    const handleFavorite = (game) => {
        console.log('Añadiendo a favoritos:', game.title);
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
                    <select className="p-2 rounded-lg bg-gray-700 text-white">
                        <option>Categoría</option>
                        <option>Aventura</option>
                        <option>RPG</option>
                        <option>Acción</option>
                    </select>

                    <select className="p-2 rounded-lg bg-gray-700 text-white">
                        <option>Editor</option>
                        <option>Ubisoft</option>
                        <option>EA</option>
                        <option>Nintendo</option>
                    </select>

                    <input 
                        type="number" 
                        className="p-2 rounded-lg bg-gray-700 text-white" 
                        placeholder="Precio máximo" 
                    />
                    
                    <label className="flex items-center text-white">
                        <input type="checkbox" className="mr-2" />
                        Con descuento
                    </label>
                </div>

                <Product
                    games={games_list}
                    onBuy={handleBuy}
                    onFavorite={handleFavorite}
                />
            </div>
        </div>
    );
};

export default Products;