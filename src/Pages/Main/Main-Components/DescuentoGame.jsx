const DescuentoGame = () => {
    const discountedGames = [
        { id: 1, title: "The Witcher 3", originalPrice: 59.99, discountPrice: 29.99, discount: 50, image: "https://via.placeholder.com/280x160", description: "Un épico juego de rol de mundo abierto", rating: 4.9 },
        { id: 2, title: "Red Dead Redemption 2", originalPrice: 69.99, discountPrice: 45.99, discount: 35, image: "https://via.placeholder.com/280x160", description: "Una aventura en el salvaje oeste", rating: 4.8 },
        { id: 3, title: "Cyberpunk 2077", originalPrice: 59.99, discountPrice: 39.99, discount: 33, image: "https://via.placeholder.com/280x160", description: "Una aventura futurista en Night City", rating: 4.5 },
        { id: 4, title: "God of War", originalPrice: 49.99, discountPrice: 29.99, discount: 40, image: "https://via.placeholder.com/280x160", description: "Una épica aventura nórdica", rating: 4.9 },
        { id: 5, title: "Elden Ring", originalPrice: 59.99, discountPrice: 44.99, discount: 25, image: "https://via.placeholder.com/280x160", description: "Un desafiante juego de rol de acción", rating: 4.7 }
    ];

    const handleBuy = (game) => {
        console.log(`Comprando ${game.title} por $${game.discountPrice}`);
    };

    const handleFavorite = (game) => {
        console.log(`Añadiendo ${game.title} a favoritos`);
    };

    const handleGoGame = (title) => {
        console.log(`Navegando al detalle del juego: ${title}`);
    };

    return (
        <div className="section-card">
            <div className="section-header">
                <h2>Juegos en Descuento</h2>
            </div>
            <div className="discounted-games-grid">
                {discountedGames.map(game => (
                    <div key={game.id} className="game-card">
                        <img src={game.image} alt={game.title} />
                        <div className="discount-badge">-{game.discount}%</div>
                        <div className="game-info">
                            <div className="game-title">
                                {game.title}
                                <i className="fa-regular fa-eye seeGameIcon" onClick={() => handleGoGame(game.title)}></i>
                            </div>
                            <div className="price-info">
                                <span className="original-price">${game.originalPrice}</span>
                                <span className="discount-price">${game.discountPrice}</span>
                            </div>
                            <div className="card-buttons">
                                <button onClick={() => handleBuy(game)} className="btn-primary">
                                    Comprar
                                </button>
                                <button onClick={() => handleFavorite(game)} className="btn-secondary">
                                    <i className="fa-regular fa-bookmark"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DescuentoGame;