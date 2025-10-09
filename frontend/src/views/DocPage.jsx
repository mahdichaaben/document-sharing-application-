import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@context/AuthContext';
import { BsFolder, BsThreeDots, BsShare } from 'react-icons/bs'; // Folder, three-dots, and share icons
import FolderFiles from './FolderFiles';
import ModalFolder from '@components/modals/ModalFolder';
import ModalUpload from '@components/modals/modalupload';
import ModalShareFolder from '@components/modals/ModalShareFolder'; // Import modal for sharing folder
import folderService from '@services/FolderService';

const API_URL = import.meta.env.VITE_APP_API_URL;

const DocPage = () => {
    const { authUser } = useAuth();
    const [folders, setFolders] = useState([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [newName, setNewName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visibleFiles, setVisibleFiles] = useState({});
    const [activeFolderMenu, setActiveFolderMenu] = useState(null);
    const [uploadModal, setUploadModal] = useState({ show: false, folderId: null });
    const [newFolderName, setNewFolderName] = useState('');
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const [shareModal, setShareModal] = useState({ show: false, folderId: null });
    const [searchEmail, setSearchEmail] = useState('');

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                if (authUser?.token) {
                    const userFolders = await folderService.getUserFolders(authUser.token);
                    setFolders(userFolders);
                }
            } catch (error) {
                console.error('Error fetching folders:', error);
                setMessage('Failed to fetch folders.');
            }
        };
        fetchFolders();
    }, [authUser?.token]);

    const toggleFileVisibility = (folderId) => {
        setVisibleFiles((prev) => ({
            ...prev,
            [folderId]: !prev[folderId],
        }));
    };

    const handleUploadFile = async (e) => {
        e.preventDefault();

        if (!file || !newName) {
            setMessage('Please fill in all fields.');
            return;
        }

        const fileData = {
            file: file,
            newName: newName,
            folderId: uploadModal.folderId,
        };

        setIsSubmitting(true);

        try {
            const response = await folderService.uploadFile(authUser?.token, fileData);
            setMessage(`File uploaded successfully: ${response.name}`);
            setFile(null);
            setNewName('');
            setUploadModal({ show: false, folderId: null });
        } catch (error) {
            setMessage('Error uploading file');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddFolder = async (e) => {
        e.preventDefault();

        if (!newFolderName) {
            setMessage('Folder name cannot be empty.');
            return;
        }

        try {
            const newFolder = await folderService.createFolder(authUser?.token, newFolderName);
            setFolders((prevFolders) => [...prevFolders, newFolder]);
            setNewFolderName('');
            setShowAddFolderModal(false);
            setMessage('Folder added successfully.');
        } catch (error) {
            console.error('Error adding folder:', error);
            setMessage('Failed to add folder.');
        }
    };

    const handleDeleteFolder = async (folderId) => {
        if (!window.confirm('Are you sure you want to delete this folder?')) return;

        try {
            await folderService.deleteFolder(authUser?.token, folderId);
            setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== folderId));
            setMessage('Folder deleted successfully.');
        } catch (error) {
            console.error('Error deleting folder:', error);
            setMessage('Failed to delete folder.');
        }
    };

    const toggleFolderMenu = (folderId) => {
        setActiveFolderMenu((prev) => (prev === folderId ? null : folderId));
    };

    const openShareModal = async (folderId) => {
        try {


            setShareModal({
                show: true,
                folderId,
            });
        } catch (error) {
            console.error('Error fetching shared users:', error);
            setMessage('Failed to fetch shared users.');
        }
    };


    const handleShareFolder = async (selectedEmails) => {
        try {
            const response = await folderService.shareFolder(authUser?.token, shareModal.folderId, selectedEmails);
            console.log(response)

        } catch (error) {
            setMessage('Error sharing folder.');
        }
    };



    return (
        <div className="mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
            <button
                onClick={() => setShowAddFolderModal(true)}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Add Folder
            </button>

            {folders.length === 0 ? (
                <p>No folders available</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {folders.map((folder) => (
                        <div key={folder.id} className="relative bg-gray-100 p-4 rounded-lg shadow-md">
                            <BsFolder size={50} className="text-yellow-500 mb-4" />
                            <h4 className="text-lg font-semibold text-gray-800">{folder.name}</h4>
                            <div className=''>
                                <button
                                    onClick={() => toggleFolderMenu(folder.id)}
                                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                                >
                                    <BsThreeDots size={20} />
                                </button>

                                <button
                                    onClick={() => openShareModal(folder.id)}
                                    className="absolute top-2 right-10 text-gray-600 hover:text-gray-800"
                                >
                                    <BsShare size={20} />
                                </button>

                            </div>

                            {activeFolderMenu === folder.id && (
                                <div className="absolute top-10 right-2 bg-white border border-gray-300 rounded-md shadow-lg p-2 w-32">
                                    <button
                                        onClick={() => setUploadModal({ show: true, folderId: folder.id })}
                                        className="block text-blue-600 text-sm py-1 px-2 w-full text-left"
                                    >
                                        Add File
                                    </button>
                                    <button
                                        onClick={() => toggleFileVisibility(folder.id)}
                                        className="block text-blue-600 text-sm py-1 px-2 w-full text-left"
                                    >
                                        {visibleFiles[folder.id] ? 'Hide Files' : 'Show Files'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteFolder(folder.id)}
                                        className="block text-red-600 text-sm py-1 px-2 w-full text-left"
                                    >
                                        Delete Folder
                                    </button>
                                </div>
                            )}

                            {visibleFiles[folder.id] && <FolderFiles folderfiles={folder.files} />}
                        </div>
                    ))}
                </div>
            )}

            <ModalUpload
                show={uploadModal.show}
                onClose={() => setUploadModal({ show: false, folderId: null })}
                onSubmit={handleUploadFile}
                file={file}
                setFile={setFile}
                newName={newName}
                setNewName={setNewName}
                isSubmitting={isSubmitting}
            />

            <ModalFolder
                show={showAddFolderModal}
                onClose={() => setShowAddFolderModal(false)}
                onSubmit={handleAddFolder}
                newFolderName={newFolderName}
                setNewFolderName={setNewFolderName}
            />
                {shareModal.show && (
                    <ModalShareFolder
                        show={shareModal.show}
                        onClose={() => setShareModal({ show: false, folderId: null, emails: [] })}
                        folderId={shareModal.folderId} // Use folderId from the shareModal state
                    />
                )}


            {message && (
                <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default DocPage;
