import Banner from '../../components/Banner/Banner';
import DescuentoGame from './Main-Components/DescuentoGame';
import TopGame from './Main-Components/TopGame';
import TopGroup from './Main-Components/TopGroup';
import './Main.css';

const Main = () => {
    return (
        <div className="home-container">
            <Banner />
            <div className="home-content">
                <DescuentoGame />
                <TopGame />
                <TopGroup />
            </div>
        </div>
    );
};

export default Main;