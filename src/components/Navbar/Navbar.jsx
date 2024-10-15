import { Link } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import "./Navbar.css";

const Navbar = () => {
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="headerNavbar">
            <Link to="/" className="logo">LK-Shop</Link>
            <nav className="navbar">
                <Link to="/" className="BTN-Pages">Home</Link>
                <Link to="/products" className="BTN-Pages">Products</Link>
                <Link to="/services" className="BTN-Pages">Services</Link>
                <Link to="/contact" className="BTN-Pages">Contact</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/account" className="BTN-Account">Mi Cuenta</Link>
                        <Link to="#" onClick={handleLogout} className="BTN-CloseAccount">
                            <i className="fa-solid fa-door-open"></i>
                        </Link>
                    </>
                ) : (
                    <Link to="/login" className="BTN-Login">Sign Up</Link>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
