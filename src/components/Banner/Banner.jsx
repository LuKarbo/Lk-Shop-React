import { useEffect, useState } from 'react';
import { Carousel } from 'bootstrap';
import { GamesAPI } from '../../BackEnd/API/GamesAPI';
import './Banner.css';

const Banner = () => {
    const [games, setGames] = useState([]);

    const randomMessages = [
        "No te lo pierdas.",
        "Explora este increíble juego.",
        "Juego del momento.",
        "Descubre una nueva aventura.",
        "¡Imperdible!",
        "Experimenta la mejor experiencia de juego.",
        "Máxima diversión garantizada."
    ];

    const getRandomMessage = () => {
        const index = Math.floor(Math.random() * randomMessages.length);
        return randomMessages[index];
    };

    useEffect(() => {
        const getAllGames = async () => {
            try {
                const allGames = await GamesAPI.getAllGames();
                
                const sortedGames = allGames.data
                    .sort((a, b) => b.copias_cantidad - a.copias_cantidad)
                    .slice(0, 3);
                
                setGames(sortedGames);
            } catch(err) {
                console.error('Error fetching all games:', err);
            }
        };

        getAllGames();

        const carouselElement = document.getElementById('carouselExample');
        const carousel = new Carousel(carouselElement, {
            interval: 5000,
            ride: 'carousel'
        });

        return () => {
            if (carousel) {
                carousel.dispose();
            }
        };
    }, []);

    return (
        <div id="carouselExample" className="carousel slide banner">
            <div className="carousel-inner">
                {games.map((game, index) => (
                    <div 
                        key={game.id_game} 
                        className={`carousel-item ${index === 0 ? 'active' : ''}`}
                    >
                        <img 
                            src={game.gameBanner || "https://via.placeholder.com/800x400"} 
                            className="d-block w-100" 
                            alt={game.game_name} 
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h3>{game.game_name}</h3>
                            <p>{getRandomMessage()}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                className="carousel-control-prev" 
                type="button" 
                data-bs-target="#carouselExample" 
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
            </button>
            <button 
                className="carousel-control-next" 
                type="button" 
                data-bs-target="#carouselExample" 
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
            </button>
        </div>
    );
};

export default Banner;