package com.mahdi.docProject.services.interfaces;

import com.mahdi.docProject.models.File;

import java.util.List;

public interface FileMetadataService {

    // Save file metadata
    File saveFileMetadata(File file);

    // Get file metadata by ID
    File getFileMetadata(String fileId);

    // Get all files by folder ID
    List<File> getFilesByFolderId(String folderId);

    List<File> getAllFileMetadata();
    // Delete file by ID
    void deleteFile(String fileId);
}
