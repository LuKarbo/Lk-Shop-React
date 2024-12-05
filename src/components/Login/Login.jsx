import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserApi } from '../../BackEnd/API/UserApi';
import { useAuth } from '../../BackEnd/Auth/AuthContext';
import logo from '../../assets/logo.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showBannedModal, setShowBannedModal] = useState(false);
    const navigate = useNavigate();
    const { login, logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const loginResult = await UserApi.login(email, password);

        if (loginResult.success) {
            console.log(loginResult.user)
            if (loginResult.user.status == 3) {
                setShowBannedModal(true);
                logout();
                return;
            }

            const userResult = await UserApi.getCurrentUser(
                loginResult.user.id,
                loginResult.accessToken
            );

            if (userResult.success) {
                login(userResult.user, loginResult.accessToken, loginResult.refreshToken);
                navigate('/');
            } else {
                setError(userResult.message);
            }
        } else {
            setError(loginResult.message);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
                    <div className="text-center mb-6">
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="mx-auto h-20 w-20 mb-4 rounded-full" 
                        />
                        <h2 className="text-2xl font-bold text-gray-800">Bienvenido de nuevo</h2>
                        <p className="text-gray-600 mt-2">
                            ¿No tienes una cuenta? 
                            <Link to="/register" className="text-blue-600 hover:text-blue-800 ml-1">
                                ¡Créala hoy!
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label 
                                htmlFor="email" 
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Correo electrónico"
                            />
                        </div>

                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contraseña"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>

            {showBannedModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Cuenta Bloqueada</h2>
                        <p className="text-gray-600 mb-6">
                            Tu cuenta ha sido suspendida.
                        </p>
                        <button
                            onClick={() => setShowBannedModal(false)}
                            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;