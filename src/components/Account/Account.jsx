import { useEffect } from 'react';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const Account = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // REVEER LA CLASE ÚLTIMOS MINUTOS PARA MEJOR IMPLEMENTACIÓN
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);
    // -----------------------------------------------------

    return (
        <div className="account">
            <h1>Mi Cuenta</h1>
            {isLoggedIn ? (
                <p>Tu email: {localStorage.getItem('email')}</p>
            ) : (
                <p>No has iniciado sesión.</p>
            )}
        </div>
    );
};

export default Account;
