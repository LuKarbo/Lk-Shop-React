import { Link } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
    return (
        <div className="headerNavbar">
            <Link to="/" className="logo">LK-Shop</Link>
            <nav className="navbar">
                <Link to="/" className="BTN-Pages">Home</Link>
                <Link to="/products" className="BTN-Pages">Products</Link>
                <Link to="/services" className="BTN-Pages">Services</Link>
                <Link to="/contact" className="BTN-Pages">Contact</Link>
                <Link to="/login" className="BTN-Login">Sign Up</Link>
            </nav>
        </div>
    );
}

export default Navbar;
