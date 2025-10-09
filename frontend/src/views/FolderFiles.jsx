import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';

import folderService from '@services/FolderService';

const API_URL = import.meta.env.VITE_APP_API_URL;

const FolderFiles = ({ folderfiles }) => {
    const { authUser } = useAuth();
    const [files, setFiles] = useState(folderfiles);
    const [message, setMessage] = useState('');

    const handleDelete = async (fileId) => {
        try {
            // Call the deleteFile method from folderService
            await folderService.deleteFile(authUser?.token, fileId);

            // Update the state to remove the deleted file
            setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
            setMessage('File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            setMessage('Error deleting file.');
        }
    };

    const isImage = (file) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
        return imageExtensions.includes(file.fileExtension);
    };

    const toggleDetails = (fileId) => {
        setFiles((prevFiles) =>
            prevFiles.map((file) =>
                file.id === fileId ? { ...file, showDetails: !file.showDetails } : file
            )
        );
    };

    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
            <div className="space-y-6">
                {files.length === 0 ? (
                    <p className="text-center py-6 text-gray-500">No files available.</p>
                ) : (
                    files.map((file) => (
                        <div
                            key={file.id}
                            className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-800">{file.name}</h4>
                                <button
                                    onClick={() => toggleDetails(file.id)}
                                    className="text-blue-600 hover:underline font-medium focus:outline-none"
                                >
                                    {file.showDetails ? 'Hide Details' : 'Show Details'}
                                </button>
                            </div>

                            {file.showDetails && (
                                <div className="mt-4 space-y-3">
                                    <p><strong>File ID:</strong> {file.id}</p>
                                    <p><strong>File Type:</strong> {file.fileType}</p>
                                    <p><strong>Folder ID:</strong> {file.folderId}</p>
                                    <div>
                                        <strong>Preview:</strong>
                                        {isImage(file) ? (
                                            <img
                                                src={file.fileUrl}
                                                alt={file.name}
                                                className="max-w-[150px] h-auto rounded-lg mt-3 border border-gray-300"
                                            />
                                        ) : (
                                            <p className="mt-2 text-gray-600">No preview available</p>
                                        )}
                                    </div>

                                    {/* Add the download link for the file */}
                                    <div>
                                        <strong>Show ressource:</strong>
                                        <a
                                            href={file.fileUrl}
                                            download={file.name}
                                            className="text-blue-600 hover:underline mt-2 block"
                                        >
                                             {file.name}
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleDelete(file.id)}
                                    className="bg-red-500 text-white py-2 px-5 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {message && (
                <p
                    className={`mt-6 text-center text-lg font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default FolderFiles;
