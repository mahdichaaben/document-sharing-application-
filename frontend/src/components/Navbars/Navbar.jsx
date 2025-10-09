import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaCog, FaFolder, FaShareAlt, FaBars, FaTimes } from 'react-icons/fa'; // Importing icons

const Navbar = () => {
  const { isLoggedIn, authUser, logout } = useAuth(); // Access auth user and login status
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control mobile menu visibility

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/auth/login'); // Redirect to login page after logout
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle mobile menu visibility
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 shadow-md">
      <div className="flex items-center justify-between container mx-auto px-4">
        {/* Branding */}
        <div className="text-white text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          ShareDoc
        </div>

        {/* Desktop View */}
        <div className="hidden sm:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              {/* Display user info */}
              <div className="text-white text-sm flex items-center">
                <FaUserCircle className="mr-2" size={20} />
                <span className="font-semibold">{authUser?.name || authUser?.email}</span>
              </div>

              <div className="flex space-x-4">
                {/* Navigation buttons */}
                <button
                  onClick={() => navigate('/settings')}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center"
                >
                  <FaCog className="mr-2" />
                  Settings
                </button>
                <button
                  onClick={() => navigate('/doc')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center"
                >
                  <FaFolder className="mr-2" />
                  My Folders
                </button>
                <button
                  onClick={() => navigate('/shared')}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-300 flex items-center"
                >
                  <FaShareAlt className="mr-2" />
                  Shared Folders
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Login and Sign Up buttons for guests */}
              <button
                onClick={() => navigate('/auth/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white text-2xl"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />} {/* Display hamburger icon or close icon */}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-gradient-to-r from-indigo-600 to-blue-500 p-4">
          {isLoggedIn ? (
            <div className="flex flex-col items-start space-y-4">
              <button
                onClick={() => navigate('/settings')}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 w-full flex items-center"
              >
                <FaCog className="mr-2" />
                Settings
              </button>
              <button
                onClick={() => navigate('/doc')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 w-full flex items-center"
              >
                <FaFolder className="mr-2" />
                My Folders
              </button>
              <button
                onClick={() => navigate('/shared')}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-300 w-full flex items-center"
              >
                <FaShareAlt className="mr-2" />
                Shared Folders
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 w-full flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-start space-y-4">
              <button
                onClick={() => navigate('/auth/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 w-full"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 w-full"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
