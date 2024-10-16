import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import "./Navbar.css";

const Navbar = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    return (
        <div className="headerNavbar">
            <Link to="/" className="logo">LK-Shop</Link>
            <nav className="navbar">
                <Link to="/" className="BTN-Pages">Inicio</Link>
                <Link to="/products" className="BTN-Pages">Productos</Link>
                <Link to="/groups" className="BTN-Pages">Grupos</Link>
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
