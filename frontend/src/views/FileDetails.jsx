import React from 'react';

const FileDetail = ({ file, onDelete }) => {
    return (
        <li key={file._id} className="mb-4">
            <div className="flex justify-between items-start">
                <p className="text-sm text-gray-700">
                    <strong>Name:</strong> {file.name} <br />
                    <strong>Type:</strong> {file.fileType} <br />
                    <strong>URL:</strong> 
                    <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {file.fileUrl}
                    </a>
                </p>
                <button
                    onClick={() => onDelete(file._id)}
                    className="text-red-500 hover:text-red-700 font-bold"
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

export default FileDetail;
