import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

const folderService = {
  getUserFolders: async (token) => {
    const response = await axios.get(`${API_URL}/api/folders/owner`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },



  getSharedFolders: async (token) => {
    const response = await axios.get(`${API_URL}/api/folders/shared`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createFolder: async (token, folderName) => {
    const response = await axios.post(
      `${API_URL}/api/folders/create`,
      { name: folderName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  deleteFolder: async (token, folderId) => {
    const response = await axios.delete(`${API_URL}/api/folders/${folderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  uploadFile: async (token, fileData) => {
    const formData = new FormData();
    formData.append('file', fileData.file); 
    formData.append('newName', fileData.newName); 
    formData.append('folderId', fileData.folderId); 
  
    try {
      const response = await axios.post(
        `${API_URL}/api/files/upload`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      return response.data; 
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; 
    }
  },








  deleteFile: async (token, fileId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; 
    } catch (error) {
      throw new Error('Error deleting file');
    }
  },





  updateUserPhoto: async (token, file) => {
    const formData = new FormData();
    formData.append('file', file.data);

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
  



  



  getSharedWithUsers: async (token, folderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/folders/${folderId}/sharedwith`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; 
    } catch (error) {
      throw new Error('Error retrieving shared users');
    }
  },


  getNotSharedWithUsers: async (token, folderId) => {
    try {
        // Fetch the list of users the folder is shared with
        const response = await axios.get(`${API_URL}/api/folders/${folderId}/notsharedwith`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const notsharedWithUsers = response.data;


        return notsharedWithUsers; // Returns the list of users the folder is not shared with
    } catch (error) {
        throw new Error('Error retrieving users not shared with the folder');
    }
},


  shareFolder: async (token, folderId, usersemails) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/folders/${folderId}/share`,
        usersemails , 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the response (e.g., confirmation)
    } catch (error) {
      throw new Error('Error sharing folder');
    }
  },






  getFoldersSharedWithUser: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/folders/sharedwithuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Returns the list of folders shared with the user
    } catch (error) {
      throw new Error('Error fetching shared folders');
    }
  },
  
};

export default folderService;
