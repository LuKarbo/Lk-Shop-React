// src/pages/Products.jsx
import { useState } from 'react';
import GameCard from '../../components/GameCard/GameCard';
import './Products.css';

const Products = () => {
    const [search, setSearch] = useState('');

    return (
        <div className="products-container">
            <div className="search-bar">
                <input type="text" placeholder="Buscar juegos..." className="form-control" />
            </div>

            <div className="filters">
                <select className="form-select">
                <option>Categoría</option>
                <option>Aventura</option>
                <option>RPG</option>
                <option>Acción</option>
                </select>

                <select className="form-select">
                <option>Editor</option>
                <option>Ubisoft</option>
                <option>EA</option>
                <option>Nintendo</option>
                </select>

                <input type="number" className="form-control" placeholder="Precio máximo" />
                <input type="checkbox" id="discount" /> <label htmlFor="discount">Con descuento</label>
            </div>

            <div className="product-card-list">
                {/* Aquí puedes mapear varias tarjetas de productos */}
                <GameCard />
                <GameCard />
                <GameCard />
            </div>
        </div>
    );
};

export default Products;
