
import React from 'react';
const ModalFolder = ({ show, onClose, onSubmit, newFolderName, setNewFolderName }) => {
    if (!show) return null; // Do not render if `show` is false

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Create a New Folder</h3>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="folderName"
                        >
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
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none"
                        >
                            Create Folder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalFolder;
