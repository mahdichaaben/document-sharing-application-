import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { BsFolder, BsEye } from 'react-icons/bs'; // Folder and eye icons
import folderService from '@services/FolderService';
import { authService } from '@services/AuthService';
import FolderFiles from '@views/FolderFiles';

const SharedFolders = () => {
    const { authUser } = useAuth();
    const [sharedFolders, setSharedFolders] = useState([]);
    const [message, setMessage] = useState('');
    const [visibleFiles, setVisibleFiles] = useState({}); // To track the visibility of files for each folder
    const [folderOwners, setFolderOwners] = useState({}); // To store owner details (email and photoPath)

    useEffect(() => {
        const fetchSharedFolders = async () => {
            try {
                if (authUser?.token) {
                    const folders = await folderService.getFoldersSharedWithUser(authUser.token);
                    setSharedFolders(folders);

                    const ownerDetails = await Promise.all(
                        folders.map(async (folder) => {
                            const owner = await authService.getUserById(authUser.token, folder.ownerId);
                            return { [folder.id]: owner }; // Return owner info for each folder
                        })
                    );

                    // Flatten the array of owner details into an object
                    setFolderOwners(ownerDetails.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
                }
            } catch (error) {
                console.error('Error fetching shared folders:', error);
                setMessage('Failed to fetch shared folders.');
            }
        };
        fetchSharedFolders();
    }, [authUser?.token]);

    const toggleFileVisibility = (folderId) => {
        setVisibleFiles((prevState) => ({
            ...prevState,
            [folderId]: !prevState[folderId], // Toggle visibility
        }));
    };

    return (
        <div className="mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-xl font-semibold mb-4">Folders Shared With Me</h2>

            {sharedFolders.length === 0 ? (
                <p>No shared folders available</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sharedFolders.map((folder) => (


                        <div key={folder.id} >


                            <div className="mt-4 flex items-center text-gray-700 space-x-3">
                                {/* Owner Photo */}
                                {folderOwners[folder.id]?.photoPath && (
                                    <img
                                        src={folderOwners[folder.id]?.photoPath}
                                        alt="Owner Photo"
                                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                    />
                                )}

                                {/* Owner Email */}
                                <div>
                                    <p className="text-sm font-semibold">{folderOwners[folder.id]?.email || 'Loading email...'}</p>
                                    <p className="text-xs text-gray-500">Owner</p>
                                </div>
                            </div>






                            <div className="relative bg-gray-100 p-4 rounded-lg shadow-md">




                                <BsFolder size={50} className="text-yellow-500 mb-4" />
                                <h4 className="text-lg font-semibold text-gray-800">{folder.name}</h4>

                                <div className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => toggleFileVisibility(folder.id)}>
                                    <BsEye size={20} />
                                </div>

                                {/* Show files if visibility is true */}
                                {visibleFiles[folder.id] && <FolderFiles folderfiles={folder.files} />}


                            </div>

                        </div>
                    ))}
                </div>
            )}

            {message && (
                <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default SharedFolders;
