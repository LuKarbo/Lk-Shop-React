import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Account from './components/Account/Account';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="main-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/products" element={<div>Products Page</div>} />
            <Route path="/services" element={<div>Services Page</div>} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
