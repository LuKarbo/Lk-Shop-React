import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { ChevronDown } from 'lucide-react';
import "./Navbar.css";

const Navbar = () => {
    const { isLoggedIn, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    const toggleAccountMenu = () => {
        setIsAccountMenuOpen((prevState) => !prevState);
    };

    return (
        <div className="headerNavbar">
        <Link to="/" className="logo">LK-Shop</Link>
        <nav className="navbar">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/products" className="nav-link">Productos</Link>
            <Link to="/groups" className="nav-link">Grupos</Link>
            <Link to="/suport" className="nav-link">Soporte</Link>
            {isLoggedIn ? (
            <>
                {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">
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
                    <Link to="/account" className="dropdown-item">
                        Mi Perfil
                    </Link>
                    <Link to="/mygroups" className="dropdown-item">
                        Mis Grupos
                    </Link>
                    <Link to="/mylibrary" className="dropdown-item">
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
            <Link to="/login" className="nav-link login-link">
                Sign Up
            </Link>
            )}
        </nav>
        </div>
    );
};

export default Navbar;