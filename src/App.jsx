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
import Admin from './Pages/Admin/Admin';
import Game from './Pages/Game/Game';
import MyGroups from './Pages/MyGroups/MyGroups';
import MyLibrary from './Pages/MyLibrary/MyLibrary';
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
              <Route path="/suport" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/mygroups" element={<MyGroups />} />
              <Route path="/mylibrary" element={<MyLibrary/>} />
              <Route path="/myreviews" element={<></>} />
              <Route path="/admin" element={<Admin/>} />
              <Route path="/game/:id" element={<Game/>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
