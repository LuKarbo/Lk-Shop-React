import GameCardList from '../GameCard_List/GameCard_list';
import './ParentComponent.css';

const ParentComponent = () => {
    return (
        <div className="games-list-container">
            <GameCardList title="Aventura" cantidad={3} />
            <GameCardList title="Accion" cantidad={2} />
            <GameCardList title="Estrategia" cantidad={5} />
        </div>
    );
};

export default ParentComponent;
