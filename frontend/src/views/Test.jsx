import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@context/AuthContext'; // Assuming you're using an AuthContext to manage user authentication

const Test = () => {
    const { authUser } = useAuth(); // Access the authenticated user from context
    const [file, setFile] = useState(null);
    const [newName, setNewName] = useState('');
    const [folderId, setFolderId] = useState('');
    const [message, setMessage] = useState('');

    // Handle file change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !newName || !folderId) {
            setMessage('Please fill in all fields.');
            return;
        }

        // Create form data for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('newName', newName);
        formData.append('folderId', folderId);

        try {
            // Make POST request to upload the file, including the Authorization header with the token
            const response = await axios.post('http://localhost:8081/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authUser?.token}`, // Include token in the header
                },
            });

            // Success
            setMessage(`File uploaded successfully: ${response.data.name}`);
        } catch (error) {
            // Error
            setMessage('Error uploading file');
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Upload a File</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="file">
                        File
                    </label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="newName">
                        New Name
                    </label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter new file name"
                        className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="folderId">
                        Folder ID
                    </label>
                    <input
                        type="text"
                        value={folderId}
                        onChange={(e) => setFolderId(e.target.value)}
                        placeholder="Enter folder ID"
                        className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Upload
                </button>
            </form>

            {message && (
                <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Test;
