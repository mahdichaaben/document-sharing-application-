// authService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      if (response.data.success) {
        const { token, userName, email } = response.data;
        return { token, userName, email };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error(error.response?.data || 'An error occurred during login');
    }
  },

  register: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, { email, password });
      if (response.status === 201) {
        const { email, name, id } = response.data;
        return { email, name, id };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      throw new Error(error.response?.data || 'An error occurred during registration');
    }
  },

  logout: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.status === 200;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred during logout');
    }
  },

  fetchUserData: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const { email, userName } = response.data;
        return { email, userName, token };
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      throw new Error(error.response?.data || 'An error occurred during fetching user data');
    }
  },





  updatePassword: async (token, oldPassword, newPassword) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/updatepassword`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'An error occurred while updating the password');
    }
  },

  getUserInfo: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'An error occurred while fetching user info');
    }
  },





  getUserById: async (token,id) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'An error occurred while fetching user info');
    }
  },







  updateProfile: async (token,formData) => {
    try {
      const response = await axios.put(`${API_URL}/api/auth/userinfo`,formData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'An error occurred while fetching user info');
    }
  },





  updateUserPhoto: async (token, fileData) => {
    const formData = new FormData();
    formData.append('file', fileData.file);

    try {
      const response = await axios.put(`${API_URL}/api/auth/userphoto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; 
    } catch (error) {
      console.error('Error updating profile photo:', error);
      throw new Error('Error updating profile photo');
    }
  },



  
};
