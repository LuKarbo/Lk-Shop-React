import { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { useAuth } from '../../BackEnd/Auth/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const storedEmail = localStorage.getItem('email');
        const storedPassword = localStorage.getItem('password');

        if (email === storedEmail) {
            const match = await bcrypt.compare(password, storedPassword);
            if (match) {
                login(email); 
                navigate('/');
            } else {
                setError('Credenciales inválidas');
            }
        } else {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Log In</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>No tienes cuenta? <Link to="/register" style={{ color: '#5BC0BE' }}>Crea una aquí</Link></p>
        </div>
    );
};

export default Login;
