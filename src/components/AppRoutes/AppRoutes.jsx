import { Routes, Route } from 'react-router-dom';
import Main from "../Main/Main";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Account from '../Account/Account';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/products" element={<div>Products Page</div>} />
            <Route path="/services" element={<div>Services Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
        </Routes>
    );
};

export default AppRoutes;
