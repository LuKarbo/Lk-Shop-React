import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import '../Login/Login.css';
import logo from '../../assets/logo.jpg';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            localStorage.setItem('email', email);
            localStorage.setItem('password', hashedPassword);
            navigate('/login');
        } catch (err) {
            setError('Error al crear la cuenta. Por favor, intente nuevamente.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="Logo" className="login-logo" />
                    <div className="welcome-text">Crear nueva cuenta</div>
                    <div className="signup-text">
                        <span>¿Ya tienes una cuenta?</span>
                        <Link to="/login" className="signup-link">Inicia sesión</Link>
                    </div>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label label-color">Nombre</label>
                        <input
                            id="name"
                            type="text"
                            className="input-field"
                            placeholder="Tu nombre completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label label-color">Confirmar Contraseña</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="input-field"
                            placeholder="Confirma tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="sign-in-button">
                        Crear Cuenta
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;