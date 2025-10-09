import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@context/AuthContext';
import FolderFiles from './FolderFiles';

const API_URL = import.meta.env.VITE_APP_API_URL; // Get API URL from environment variables

const TestCrudFolderPrev = () => {
    const { authUser } = useAuth();
    const [folders, setFolders] = useState([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [newName, setNewName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visibleFiles, setVisibleFiles] = useState({});

    // Fetch all folders on mount
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/folders/owner`, {
                    headers: {
                        'Authorization': `Bearer ${authUser?.token}`,
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

    // Handle file upload
    const handleUploadFile = async (e, folderId) => {
        e.preventDefault();
        if (!file || !newName) {
            setMessage('Please fill in all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('newName', newName);
        formData.append('folderId', folderId);

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_URL}/api/files/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authUser?.token}`,
                },
            });
            setMessage(`File uploaded successfully: ${response.data.name}`);
            setFile(null);
            setNewName('');
        } catch (error) {
            setMessage('Error uploading file');
        } finally {
            setIsSubmitting(false);
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
            const response = await axios.post(`${API_URL}/api/folders/create`, { name: newFolderName }, {
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`,
                },
            });
            setFolders((prevFolders) => [...prevFolders, response.data]);
            setNewFolderName('');
            setMessage('Folder created successfully!');
        } catch (error) {
            setMessage('Error creating folder');
        }
    };

    // Handle folder deletion
    const handleDeleteFolder = async (folderId) => {
        try {
            await axios.delete(`${API_URL}/api/folders/${folderId}`, {
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`,
                },
            });
            setFolders(folders.filter((folder) => folder.id !== folderId));
            setMessage('Folder deleted successfully');
        } catch (error) {
            setMessage('Error deleting folder');
        }
    };

    // Toggle file list visibility
    const toggleFileVisibility = (folderId) => {
        setVisibleFiles((prevState) => ({
            ...prevState,
            [folderId]: !prevState[folderId],
        }));
    };

    return (
        <div className="mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Folder Management</h2>

            {/* Add Folder Form */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Create a New Folder</h3>
                <form onSubmit={handleCreateFolder} className="max-w-xl mx-auto">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="folderName">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Enter a unique folder name"
                            className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-2"
                            required
                        />
                        {message.includes("Please provide a folder name") && (
                            <p className="mt-2 text-sm text-red-500">{message}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-400"
                            disabled={isSubmitting || !newFolderName}
                        >
                            {isSubmitting ? "Creating Folder..." : "Create Folder"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Folder list */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">All Folders</h3>
            {folders.length === 0 ? (
                <p>No folders available</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {folders.map((folder) => (
                        <div key={folder.id} className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">{folder.name}</h4>

                                {/* Buttons for Upload, Delete, and File Visibility */}
                                <button
                                    onClick={() => document.getElementById(`form-${folder.id}`).classList.toggle('hidden')}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                >
                                    Upload File
                                </button>

                                <button
                                    onClick={() => handleDeleteFolder(folder.id)}
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                >
                                    Delete Folder
                                </button>

                                <button
                                    onClick={() => toggleFileVisibility(folder.id)}
                                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                                >
                                    {visibleFiles[folder.id] ? 'Hide Files' : 'Show Files'}
                                </button>
                            </div>

                            {/* File Upload Form */}
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
                                        className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
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
                                        className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full bg-blue-500 text-white py-2 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Uploading...' : 'Upload File'}
                                </button>
                            </form>

                            {/* Show file list if visible */}
                            {visibleFiles[folder.id] && <FolderFiles folderfiles={folder.files} />}
                        </div>
                    ))}
                </div>
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

export default TestCrudFolderPrev;
