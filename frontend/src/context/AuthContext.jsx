import React, { useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authService } from '@services/AuthService'; 

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUserData = async (token) => {
    try {
      const userData = await authService.fetchUserData(token);
      setAuthUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      setAuthUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      fetchUserData(token);
    } else {
      setAuthUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (authUser?.token) {
      Cookies.set('authToken', authUser.token, { expires: 7 }); // Set token in a cookie with a 7-day expiry
    } else {
      Cookies.remove('authToken');
    }
  }, [authUser]);

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setAuthUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const register = async (email, password) => {
    try {
      const userData = await authService.register(email, password);
      return userData; 
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const success = await authService.logout(token);
        if (success) {
          setAuthUser(null);
          setIsLoggedIn(false);
          Cookies.remove('authToken');
          alert('Logout successful');
        } else {
          alert('Logout failed');
        }
      } catch (error) {
        alert(`Logout failed: ${error.message}`);
      }
    } else {
      alert('No auth token found');
    }
  };

  const value = {
    authUser,
    isLoggedIn,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
