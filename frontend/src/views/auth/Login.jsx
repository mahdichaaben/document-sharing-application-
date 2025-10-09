import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext'; // Access AuthContext
const Login = () => {
  const { login, authUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSigningIn(true);

    try {
      await login(email, password); // Login function will handle errors
      navigate('/doc'); // Redirect if login is successful
    } catch (error) {
      setErrorMessage(error.message || 'Login failed: An unexpected error occurred');
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      console.log('Logged in user:', authUser);
    }
  }, [authUser]);

  return (
    <div className="container mx-auto px-4 h-full flex items-center justify-center">
      <div className="w-full lg:w-4/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="flex-auto px-4 lg:px-10 py-10">
            <div className="text-blue-600 text-center mb-3 font-bold">
              Sign in with credentials
            </div>
            <form onSubmit={onSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-gray-600 text-xs font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition-all"
                />
              </div>

              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-gray-600 text-xs font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition-all"
                />
              </div>

              {errorMessage && (
                <div className="text-center text-red-500 font-bold mb-4">
                  {errorMessage}
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  className={`bg-blue-500 text-white font-bold uppercase px-6 py-3 rounded shadow hover:bg-blue-600 focus:outline-none w-full transition-all ${
                    isSigningIn
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'hover:shadow-lg'
                  }`}
                  disabled={isSigningIn}
                >
                  {isSigningIn ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap mt-6">
              <div className="">
                <Link to="/auth/register" className="text-blue-500 text-sm font-semibold">
                  <small>Create new account</small>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
