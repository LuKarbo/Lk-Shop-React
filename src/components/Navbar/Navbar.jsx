import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./Navbar.css";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('email');
        setIsLoggedIn(!!email);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        setIsLoggedIn(false);
        navigate('/login');
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
