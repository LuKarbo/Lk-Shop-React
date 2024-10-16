import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from "./Pages/Main/Main";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Account from './Pages/Account/Account';
import Contact from './Pages/Contact/Contact';
import Products from './Pages/Products/Products';
import Groups from './Pages/Groups/Groups';
import { AuthProvider } from './BackEnd/Auth/AuthContext';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="main-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="*" element={<Main />} />
              <Route path="/products" element={<Products />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<></>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
