import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-section">
                <h4>Contacto</h4>
                <p>Email: contacto@lk-shop.com</p>
                <p>Teléfono: +54 11 5555-5555</p>
                <p>Dirección: Calle Falsa 123, Buenos Aires, Argentina</p>
            </div>

            <div className="footer-section">
                <h4>Enlaces</h4>
                <ul>
                    <li><a href="/terms">Términos y Condiciones</a></li>
                    <li><a href="/privacy">Política de Privacidad</a></li>
                    <li><a href="/help">Ayuda</a></li>
                </ul>
            </div>

            <div className="footer-section">
                <h4>Redes Sociales</h4>
                <div className="social-icons">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </div>

            <div className="footer-section copyright">
                <p>&copy; {currentYear} LK-Shop. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;
