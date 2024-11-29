import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { ChevronDown, Menu, X } from 'lucide-react';
import "./Navbar.css";

const Navbar = () => {
    const { isLoggedIn, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const toggleAccountMenu = () => {
        setIsAccountMenuOpen((prevState) => !prevState);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prevState) => !prevState);
        setIsAccountMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsAccountMenuOpen(false);
    };

    return (
        <div className="headerNavbar">
            <Link to="/" className="logo" onClick={closeMobileMenu}>LK-Shop</Link>
            
            <button 
                className="mobile-menu-toggle" 
                onClick={toggleMobileMenu}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <Link to="/" className="nav-link" onClick={closeMobileMenu}>Inicio</Link>
                <Link to="/products" className="nav-link" onClick={closeMobileMenu}>Productos</Link>
                <Link to="/groups" className="nav-link" onClick={closeMobileMenu}>Grupos</Link>
                <Link to="/suport" className="nav-link" onClick={closeMobileMenu}>Soporte</Link>
                {isLoggedIn ? (
                <>
                    {isAdmin && (
                    <Link 
                        to="/admin" 
                        className="nav-link admin-link" 
                        onClick={closeMobileMenu}
                    >
                        Admin
                    </Link>
                    )}
                    <div className="relative">
                    <button
                        className="nav-link account-link"
                        onClick={toggleAccountMenu}
                    >
                        Cuenta
                        <ChevronDown className="ml-2" size={18} />
                    </button>
                    {isAccountMenuOpen && (
                        <div className="account-dropdown">
                        <Link 
                            to="/account" 
                            className="dropdown-item"
                            onClick={closeMobileMenu}
                        >
                            Mi Perfil
                        </Link>
                        <Link 
                            to="/mygroups" 
                            className="dropdown-item"
                            onClick={closeMobileMenu}
                        >
                            Mis Grupos
                        </Link>
                        <Link 
                            to="/mylibrary" 
                            className="dropdown-item"
                            onClick={closeMobileMenu}
                        >
                            Biblioteca
                        </Link>
                        <Link
                            to="#"
                            onClick={handleLogout}
                            className="dropdown-item logout"
                        >
                            Log Out
                        </Link>
                        </div>
                    )}
                    </div>
                </>
                ) : (
                <Link 
                    to="/login" 
                    className="nav-link login-link"
                    onClick={closeMobileMenu}
                >
                    Sign Up
                </Link>
                )}
            </nav>
        </div>
    );
};

export default Navbar;