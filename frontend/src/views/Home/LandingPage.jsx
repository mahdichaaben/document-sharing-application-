import React from 'react';
import { useAuth } from '@context/AuthContext';  // Assuming you have this context set up
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { authUser } = useAuth();  // Access user data from AuthContext
  const navigate = useNavigate();    // Using useNavigate hook

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center text-white">
        <h1 className="text-5xl font-extrabold leading-tight sm:text-6xl">
          Welcome to Your File Management App
        </h1>
        <p className="mt-4 text-lg sm:text-xl font-medium">
          Simplify your file organization, sharing, and collaboration.
        </p>
        <div className="mt-8 flex justify-center space-x-6">
          {!authUser ? (
            <>
              <button
                onClick={() => navigate('/auth/login')}  // Navigate to login page
                className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/register')}  // Navigate to register page
                className="px-8 py-4 bg-green-600 text-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Register
              </button>
            </>
          ) : (
            <p className="text-lg font-semibold">
              Welcome back, {authUser.username}! Start managing your files now.
            </p>
          )}
        </div>
      </div>
      <div className="mt-12 max-w-3xl text-center mx-auto px-6">
        <h2 className="text-3xl font-semibold text-white mb-6">
          Key Features of the App
        </h2>
        <ul className="space-y-4 text-lg text-gray-200">
          <li>📁 Easily manage and organize your files in folders.</li>
          <li>🔒 Securely share and collaborate with others.</li>
          <li>📱 Access your files from anywhere, on any device.</li>
          <li>🔄 Real-time updates for efficient collaboration.</li>
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
