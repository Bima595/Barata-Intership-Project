import { useState } from 'react';
import { useAuth } from '../components/Login/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Cek apakah path saat ini adalah halaman admin
  const isAdminPage = location.pathname.includes('/admin');

  return (
    <nav className="fixed top-0 left-0 w-full text-black bg-gray-100 z-50" style={{ backgroundColor: "#F5F7FA" }}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-xl font-bold" style={{ color: "#29166F" }}>OfficeTech.</div>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          {!isAdminPage && (
            <Link to="/input" className="hover:underline">Input</Link>
          )}
          {auth && (
            <button onClick={handleLogout} className="text-red-500 hover:underline">
              Log Out
            </button>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-100 py-4 px-6">
          <Link to="/" className="block py-2 hover:underline">Home</Link>
          {!isAdminPage && (
            <Link to="/input" className="block py-2 hover:underline">Input</Link>
          )}
          {auth && (
            <button onClick={handleLogout} className="text-red-500 hover:underline block mt-4">
              Log Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
