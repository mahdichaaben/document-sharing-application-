import React, { useState, useEffect } from 'react';
import folderService from '@services/FolderService';
import { useAuth } from '@context/AuthContext';
import axios from 'axios';

const ModalShareFolder = ({ show, onClose, folderId }) => {
    const [sharedWith, setSharedWith] = useState([]);
    const [notSharedWith, setNotSharedWith] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [email, setEmail] = useState(""); // To track email input

    const { authUser } = useAuth(); // Assuming this provides the authenticated user info

    // Fetch shared and not-shared users when the modal opens
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const shared = await folderService.getSharedWithUsers(authUser.token, folderId);
                setSharedWith(shared || []); // Ensure shared is an array
                const notShared = await folderService.getNotSharedWithUsers(authUser.token, folderId);
                setNotSharedWith(notShared || []); // Ensure notShared is an array
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        if (show) {
            fetchUsers();
        }
    }, [show, folderId]); // Fetch when the modal shows or folderId changes

    // Handle adding user to the "Shared With" list
    const handleAddUser = (user) => {
        setSharedWith((prev) => [...prev, user]);
        setNotSharedWith((prev) => prev.filter((email) => email !== user));
    };

    // Handle removing user from the "Shared With" list
    const handleRemoveUser = (user) => {
        const confirmRemove = window.confirm(`Are you sure you want to remove ${user} from shared users?`);
        if (confirmRemove) {
            setSharedWith((prev) => prev.filter((email) => email !== user));
            setNotSharedWith((prev) => [...prev, user]);
        }
    };

    // Filtered list of "Not Shared With" users based on search query
    const filteredNotSharedWith = notSharedWith.filter((email) =>
        email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Share folder function
    const handleshareFolder = async () => {
        try {
            const emails = sharedWith; // Assuming userIds are just emails in sharedWith list
            const response = await folderService.shareFolder(authUser.token, folderId, emails);
            
            // Show a success alert
            alert('Folder shared successfully with the selected users!');
            
            console.log('Folder shared successfully', response.data);
            onClose(); // Close the modal after sharing
        } catch (error) {
            console.error('Error sharing folder:', error);
            alert('There was an error sharing the folder.');
        }
    };

    return (
        <div className={`fixed inset-0 bg-gray-500 bg-opacity-50 z-50 ${!show && 'hidden'}`}>
            <div className="w-full max-w-md mx-auto mt-10 bg-white p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Share Folder</h2>

                {/* Search input */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for users to share with"
                    className="mb-4 p-2 border border-gray-300 rounded"
                />

                {/* Shared With Users */}
                <h3 className="font-semibold mb-2">Shared With</h3>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {sharedWith.length > 0 ? (
                        sharedWith.map((email, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span>{email}</span>
                                <button
                                    onClick={() => handleRemoveUser(email)}
                                    className="text-red-500"
                                >
                                    - Remove
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No users shared with this folder.</p>
                    )}
                </div>

                {/* Not Shared With Users */}
                <h3 className="font-semibold mb-2">Not Shared With</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filteredNotSharedWith.length > 0 ? (
                        filteredNotSharedWith.map((email, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span>{email}</span>
                                <button
                                    onClick={() => handleAddUser(email)}
                                    className="bg-blue-600 text-white py-1 px-2 rounded"
                                >
                                    + Add
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No users to share with.</p>
                    )}
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={handleshareFolder }
                        className="bg-blue-600 text-white py-2 px-4 rounded"
                    >
                        Share
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalShareFolder;
