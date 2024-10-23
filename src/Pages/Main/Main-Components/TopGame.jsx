const TopGame = () => {
    const topGames = [
        { id: 1, title: "GTA V", sales: 1250, image: "https://via.placeholder.com/280x160", price: 29.99, rating: 4.8, description: "Acción y aventura en Los Santos" },
        { id: 2, title: "FIFA 24", sales: 980, image: "https://via.placeholder.com/280x160", price: 59.99, rating: 4.5, description: "El mejor juego de fútbol" },
        { id: 3, title: "Minecraft", sales: 850, image: "https://via.placeholder.com/280x160", price: 26.99, rating: 4.9, description: "Construye tu propio mundo" },
        { id: 4, title: "Call of Duty", sales: 780, image: "https://via.placeholder.com/280x160", price: 69.99, rating: 4.6, description: "Acción militar en primera persona" },
        { id: 5, title: "Spider-Man 2", sales: 720, image: "https://via.placeholder.com/280x160", price: 69.99, rating: 4.7, description: "Aventuras del hombre araña" }
    ];

    const handleBuy = (game) => {
        console.log(`Comprando ${game.title} por $${game.price}`);
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
                <h2>Juegos Más Comprados</h2>
            </div>
            <div className="discounted-games-grid">
                {topGames.map(game => (
                    <div key={game.id} className="game-card">
                        <img src={game.image} alt={game.title} />
                        <div className="game-info">
                            <div className="game-title">
                                {game.title}
                                <i className="fa-regular fa-eye seeGameIcon" onClick={() => handleGoGame(game.title)}></i>
                            </div>
                            <p>{game.sales} ventas</p>
                            <div className="price-info">
                                <span className="discount-price">${game.price}</span>
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

export default TopGame;