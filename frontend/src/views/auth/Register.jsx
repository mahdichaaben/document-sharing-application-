import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
  
    setIsRegistering(true);
    setErrorMessage(''); 
  
    try {
      const res = await register(email, password);
      alert('Registration successful! You can now log in.');
      navigate('/auth/login'); 
    } catch (error) {
      if (error.message === 'User already exists with this email') {
        setErrorMessage('This email is already registered. Please use a different email.');
      } else {
        setErrorMessage(error.message || 'An error occurred during registration');
      }
    } finally {
      setIsRegistering(false);
    }
  };
  

  return (
    <div className="container mx-auto px-4 h-full flex items-center justify-center">
      <div className="w-full lg:w-4/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="flex-auto px-4 lg:px-10 py-10">
            <div className="text-blue-600 text-center mb-3 font-bold">
              Sign up with credentials
            </div>
            <form onSubmit={onSubmit}>
              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition-all"
                />
              </div>

              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="email">
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
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-400 w-full transition-all"
                />
              </div>

              <div className="relative w-full mb-3">
                <label className="block uppercase text-gray-600 text-xs font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  className={`bg-blue-500 text-white font-bold uppercase px-6 py-3 rounded shadow hover:bg-blue-600 focus:outline-none w-full transition-all ${isRegistering ? 'bg-gray-400 cursor-not-allowed' : 'hover:shadow-lg'}`}
                  disabled={isRegistering}
                >
                  {isRegistering ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap mt-6">
              <div className="">
                <Link to="/auth/login" className="text-blue-500 text-sm font-semibold">
                  <small>Already have an account? Log in</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
