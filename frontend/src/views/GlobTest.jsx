import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@context/AuthContext'; // Assuming you're using an AuthContext to manage user authentication

const API_URL = import.meta.env.VITE_APP_API_URL; // Get API URL from environment variables

const TestCrudFolder = () => {
    const { authUser } = useAuth(); // Access the authenticated user from context
    const [folders, setFolders] = useState([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [newName, setNewName] = useState('');
    const [newFolderName, setNewFolderName] = useState(''); // State for new folder name
    const [isSubmitting, setIsSubmitting] = useState(false); // State to handle submission

    // Fetch all folders owned by the current user on component mount
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/folders/owner`, {
                    headers: {
                        'Authorization': `Bearer ${authUser?.token}`, // Include token in the header
                    },
                });
                setFolders(response.data);
            } catch (error) {
                console.error('Error fetching folders:', error);
                setMessage('Failed to fetch folders.');
            }
        };

        fetchFolders();
    }, [authUser?.token]);

    // Handle file change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle file upload form submission
    const handleUploadFile = async (e, folderId) => {
        e.preventDefault();
        if (!file || !newName) {
            setMessage('Please fill in all fields.');
            return;
        }

        // Create form data for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('newName', newName);
        formData.append('folderId', folderId);

        setIsSubmitting(true); // Start submitting

        try {
            // Make POST request to upload the file, including the Authorization header with the token
            const response = await axios.post(`${API_URL}/api/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authUser?.token}`, // Include token in the header
                },
            });

            // Success
            setMessage(`File uploaded successfully: ${response.data.name}`);
            setFile(null); // Clear the file input
            setNewName(''); // Clear the new name input
        } catch (error) {
            // Error
            setMessage('Error uploading file');
        } finally {
            setIsSubmitting(false); // Stop submitting
        }
    };

    // Handle new folder creation
    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName) {
            setMessage('Please provide a folder name.');
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/folders/create`,
                { name: newFolderName },
                {
                    headers: {
                        'Authorization': `Bearer ${authUser?.token}`,
                    },
                }
            );
            // Success
            setFolders((prevFolders) => [...prevFolders, response.data]); // Add the new folder to the list
            setNewFolderName(''); // Clear the input
            setMessage('Folder created successfully!');
        } catch (error) {
            // Error
            setMessage('Error creating folder');
        }
    };

    // Handle folder deletion
    const handleDeleteFolder = async (folderId) => {
        try {
            await axios.delete(`${API_URL}/api/folders/${folderId}`, {
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`, // Include token in the header
                },
            });

            // Remove the deleted folder from the state
            setFolders(folders.filter((folder) => folder.id !== folderId));
            setMessage('Folder deleted successfully');
        } catch (error) {
            setMessage('Error deleting folder');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Folder Management</h2>

            {/* Add Folder Form */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Folder</h3>
                <form onSubmit={handleCreateFolder}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="folderName">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Enter folder name"
                            className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Create Folder
                    </button>
                </form>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">All Folders</h3>

            {/* Folder list with file upload and delete button */}
            {folders.length === 0 ? (
                <p>No folders available</p>
            ) : (
                folders.map((folder) => (
                    <div key={folder.id} className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">{folder.name}</h4>

                            {/* File upload button */}
                            <button
                                onClick={() => {
                                    const formId = `form-${folder.id}`;
                                    const form = document.getElementById(formId);
                                    form.classList.toggle('hidden');
                                }}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                            >
                                Upload File
                            </button>

                            {/* Delete Folder Button */}
                            <button
                                onClick={() => handleDeleteFolder(folder.id)}
                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
                            >
                                Delete Folder
                            </button>
                        </div>

                        {/* File upload form for the specific folder */}
                        <form
                            id={`form-${folder.id}`}
                            onSubmit={(e) => handleUploadFile(e, folder.id)}
                            className="hidden"
                        >
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

                            <button
                                type="submit"
                                className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Uploading...' : 'Upload File'}
                            </button>
                        </form>
                    </div>
                ))
            )}

            {/* Display message */}
            {message && (
                <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default TestCrudFolder;
