import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@context/AuthContext'; // Assuming you're using an AuthContext to manage user authentication

const API_URL = import.meta.env.VITE_APP_API_URL; // Get API URL from environment variables

const TestCrudFile = () => {
    const { authUser } = useAuth(); // Access the authenticated user from context
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch all files on component mount
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/files/all`, {
                    headers: {
                        'Authorization': `Bearer ${authUser?.token}`, // Include token in the header
                    },
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
                setMessage('Failed to fetch files.');
            }
        };

        fetchFiles();
    }, [authUser?.token]);

    // Handle delete file
    const handleDelete = async (fileId) => {
        try {
            await axios.delete(`${API_URL}/api/files/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${authUser?.token}`, // Include token in the header
                },
            });

            // Remove deleted file from the state
            setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
            setMessage('File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            setMessage('Error deleting file.');
        }
    };

    // Helper function to check if file is an image based on extension
    const isImage = (file) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        return imageExtensions.includes(file.fileExtension);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">File Management</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4">All Files</h3>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-300">File ID</th>
                        <th className="px-4 py-2 border-b border-gray-300">File Name</th>
                        <th className="px-4 py-2 border-b border-gray-300">File Type</th>
                        <th className="px-4 py-2 border-b border-gray-300">Folder ID</th>
                        <th className="px-4 py-2 border-b border-gray-300">Preview</th>
                        <th className="px-4 py-2 border-b border-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {files.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center py-4">No files available</td>
                        </tr>
                    ) : (
                        files.map((file) => (
                            <tr key={file.id}>
                                <td className="px-4 py-2 border-b border-gray-300">{file.id}</td>
                                <td className="px-4 py-2 border-b border-gray-300">{file.name}</td>
                                <td className="px-4 py-2 border-b border-gray-300">{file.fileType}</td>
                                <td className="px-4 py-2 border-b border-gray-300">{file.folderId}</td>
                                <td className="px-4 py-2 border-b border-gray-300">
                                    {isImage(file) ? (
                                        <img
                                            src={file.fileUrl}
                                            alt={file.name}
                                            className="max-w-[100px] h-auto rounded-lg"
                                        />
                                    ) : (
                                        <p>No preview available</p>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b border-gray-300">
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {message && (
                <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default TestCrudFile;
