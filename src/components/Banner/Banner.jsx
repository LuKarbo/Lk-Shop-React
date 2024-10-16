import { useEffect } from 'react';
import { Carousel } from 'bootstrap';
import './Banner.css';

const Banner = () => {
    useEffect(() => {
        const carousel = new Carousel('#carouselExample', {
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
                <div className="carousel-item active">
                    <img src="https://via.placeholder.com/800x400" className="d-block w-100" alt="Banner 1" />
                    <div className="carousel-caption d-none d-md-block">
                        <h3>Juego Destacado 1</h3>
                        <p>Explora este increíble juego.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="https://via.placeholder.com/800x400" className="d-block w-100" alt="Banner 2" />
                    <div className="carousel-caption d-none d-md-block">
                        <h3>Juego Destacado 2</h3>
                        <p>No te lo pierdas.</p>
                    </div>
                </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
            </button>
        </div>
    );
};

export default Banner;