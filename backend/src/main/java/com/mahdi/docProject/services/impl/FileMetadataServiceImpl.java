package com.mahdi.docProject.services.impl;

import com.mahdi.docProject.models.File;
import com.mahdi.docProject.repository.FileRepository;
import com.mahdi.docProject.services.interfaces.FileMetadataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Optional;

@Service
public class FileMetadataServiceImpl implements FileMetadataService {

    @Autowired
    private FileRepository fileRepository;

    // Save file metadata to MongoDB
    @Override
    public File saveFileMetadata(File file) {
        return fileRepository.save(file);
    }

    // Retrieve file metadata by ID
    @Override
    public File getFileMetadata(String fileId) {
        Optional<File> file = fileRepository.findById(fileId);
        return file.orElse(null);  // Return null if file not found
    }

    // Get all files by folder ID
    @Override
    public List<File> getFilesByFolderId(String folderId) {
        return fileRepository.findByFolderId(folderId);  // Fetch files by folder ID
    }


    @Override
    public List<File> getAllFileMetadata() {
        return fileRepository.findAll();  // Fetch all files from the repository
    }

    // Delete file by ID
    @Override
    public void deleteFile(String fileId) {
        fileRepository.deleteById(fileId);  // Delete file from the repository
    }
}
