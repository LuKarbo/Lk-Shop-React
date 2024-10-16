import { useState, useEffect } from 'react';
import GameCard from '../GameCard/GameCard';
import './GameCard_List.css';
import gamesData from '../../BackEnd/Models/ListadoGames.json';

const GameCardList = ({ title, cantidad }) => {
    const [filteredGames, setFilteredGames] = useState([]);

    const backgroundColors = ['#0B132B', '#1C2541', '#3A506B'];
    const textColors = ['#5BC0BE', '#6FFFE9'];
    const randomBackgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    const randomTextColor = textColors[Math.floor(Math.random() * textColors.length)];

    useEffect(() => {
        const results = gamesData.filter(game => game.category.toLowerCase() === title.toLowerCase());
        setFilteredGames(results);
    }, [title]);

    return (
        <div className="games-featured-container" style={{ backgroundColor: randomBackgroundColor }}>
            <h2 className="games-title" style={{ color: randomTextColor }}>{title}</h2>
            <div className="cards-container">
                {filteredGames.slice(0, cantidad).map((game, index) => (
                    <GameCard key={index} title={game.title} price={game.price} />
                ))}
            </div>
        </div>
    );
};

export default GameCardList;
