import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserApi } from '../../BackEnd/API/UserApi';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import './Login.css';
import logo from '../../assets/logo.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const loginResult = await UserApi.login(email, password);
        
        if (loginResult.success) {
            localStorage.setItem('accessToken', loginResult.accessToken);
            localStorage.setItem('refreshToken', loginResult.refreshToken);

            const userResult = await UserApi.getCurrentUser(
                loginResult.user.id, 
                loginResult.accessToken
            );
            
            if (userResult.success) {
                login(email);
                navigate('/');
            } else {
                setError(userResult.message);
            }
        } else {
            setError(loginResult.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="Logo" className="login-logo" />
                    <div className="welcome-text">Bienvenido de nuevo</div>
                    <div className="signup-text">
                        <span>¿No tienes una cuenta?</span>
                        <Link to="/register" className="signup-link">¡Créala hoy!</Link>
                    </div>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label label-color">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="input-field"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label label-color">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            className="input-field"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="sign-in-button">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;