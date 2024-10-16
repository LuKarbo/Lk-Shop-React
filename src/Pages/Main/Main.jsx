import Banner from '../../components/Banner/Banner';
import GameCard from '../../components/GameCard/GameCard';
import ParentComponent from '../../components/ParentComponent/ParentComponent';
import './Main.css';

const Main = () => {
    return (
        <div className="home-container">
            <Banner />
            <div className="featured-games">
                <h2 className='titulo' >Juegos Destacados</h2>
                <div className="game-card-list">
                    <GameCard />
                    <GameCard />
                    <GameCard />
                </div>
            </div>
            <ParentComponent />
        </div>
    );
};

export default Main;
