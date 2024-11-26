import { createContext, useContext, useState, useEffect} from 'react';
import User from '../Model/User';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('isAdmin'));
    const [user, setUser] = useState(!!localStorage.getItem('user'));

    useEffect(() => {
        doRefreshToken();
    }, []);

    const doRefreshToken = async() => {

        if(localStorage.getItem("token")){

            try{

                const response = await axios.get("http://localhost:8888/user/refresh-token", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
    
                if(response.data.success){
                    setUser(localStorage.getItem('user'))
                    setIsLoggedIn(true);
                    setToken(response.data.accessToken);
                }

            }catch(error){
                console.log(error);
            }finally{
                setLoading(false);
            }

        }else{
            setLoading(false);
        }

    }

    const checkIfAdmin = (user) => {
        const adminRols = ['Admin','Support'];
        return adminRols.includes(user.id_permissions);
    };

    const login = (user, accessToken, refreshToken) => {
        
        const userData = Array.isArray(user) && user.length > 0 ? user[0] : user;
    
        const userIsAdmin = checkIfAdmin(userData);
    
        const userInstanceData = {
            id: userData.id_user,
            email: userData.email,
            name: userData.nombre,
            id_permissions: userData.permissions_name,
            profileIMG: userData.profileIMG,
            profileBanner: userData.profileBanner,
            isAdmin: userIsAdmin,
            status_name: userData.status_name
        };
    
        User.createInstance(userInstanceData);

        setIsLoggedIn(true);
        setToken(accessToken);
        localStorage.setItem("token", refreshToken);
        localStorage.setItem("user", userData.id_user);
    };

    const logout = () => {
        localStorage.clear();
        User.destroyInstance();
        setIsAdmin(false);
        setIsLoggedIn(false);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    axios.interceptors.request.use(
        config => {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout, token }}>
            {
                (loading)
                ?
                    <div> Cargando... </div>
                :
                    children
            }
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);