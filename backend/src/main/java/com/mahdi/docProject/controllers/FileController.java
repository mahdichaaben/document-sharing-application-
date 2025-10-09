package com.mahdi.docProject.controllers;

import com.mahdi.docProject.models.File;
import com.mahdi.docProject.models.Folder;
import com.mahdi.docProject.services.interfaces.FolderService;
import com.mahdi.docProject.storage.StorageService;
import com.mahdi.docProject.services.interfaces.FileMetadataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;  // Correct import for MultipartFile

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileMetadataService fileMetadataService;


    @Autowired
    private FolderService folderService;

    @Autowired
    private final StorageService storageService;

    @Autowired
    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    @Value("${file.storage-location}")
    private String storageLocation;

    @PostMapping("/upload")
    public ResponseEntity<?> handleFileUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "newName", required = false) String newName,
            @RequestParam(value = "folderId") String folderId) {

        try {
            String fileName = file.getOriginalFilename();
            long fileSize = file.getSize();
            String contentType = file.getContentType();

            // If newName is provided, use it; otherwise, fallback to the original file name
            String finalFileName = (newName != null && !newName.isEmpty()) ? newName : fileName;

            // Extract file extension
            String fileExtension = fileName.substring(fileName.lastIndexOf("."));

            // Create a File object to store metadata
            File metadata = new File();
            metadata.setName(finalFileName);
            metadata.setFileType(contentType);
            metadata.setFolderId(folderId);
            metadata.setFileExtension(fileExtension);  // Set the file extension

            // Save metadata to the database
            File savedFile = fileMetadataService.saveFileMetadata(metadata);
            savedFile.setUniqueFileName();
            String uniqueFileName = savedFile.getUniqueFileName();
            System.out.println(uniqueFileName);
            storageService.store(file, uniqueFileName);
            String urluniqueFileName = storageService.loadUrl(uniqueFileName);
            System.out.println(urluniqueFileName);
            savedFile.setFileUrl(urluniqueFileName);

            savedFile = fileMetadataService.saveFileMetadata(savedFile);  // Save updated file metadata

            // Return success response with file details (metadata only)



            Folder updatedFolder = folderService.addFileToFolder(folderId, savedFile);

            return ResponseEntity.ok(savedFile);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    // Get file metadata by ID
    @GetMapping("/{fileId}")
    public ResponseEntity<?> getFileMetadata(@PathVariable String fileId) {
        File file = fileMetadataService.getFileMetadata(fileId);
        if (file != null) {
            return ResponseEntity.ok(file);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable String fileId) {
        try {
            // Get the file metadata
            File file = fileMetadataService.getFileMetadata(fileId);
            if (file != null) {
                // Get the folder ID from the file metadata
                String folderId = file.getFolderId();

                // Remove the file from the folder's files list
                Folder updatedFolder = folderService.removeFileFromFolder(folderId, fileId);

                // Delete the file from the storage
                storageService.delete(file.getUniqueFileName());  // Delete the file from storage using its unique name

                // Delete file metadata from the database
                fileMetadataService.deleteFile(fileId);  // Delete the file metadata from the database

                return ResponseEntity.noContent().build();  // Successfully deleted
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");  // File not found
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting file: " + e.getMessage());  // Error
        }
    }




    @GetMapping("/folder")
    public ResponseEntity<?> getFilesByFolderId(@RequestParam String folderId) {
        try {
            List<File> files = fileMetadataService.getFilesByFolderId(folderId);
            if (files != null && !files.isEmpty()) {
                return ResponseEntity.ok(files);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No files found for the folder");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching files: " + e.getMessage());
        }
    }


    @GetMapping("/all")
    public ResponseEntity<?> getAllFileMetadata() {
        try {
            List<File> files = fileMetadataService.getAllFileMetadata();  // Fetch all files from the service
            if (files != null && !files.isEmpty()) {
                return ResponseEntity.ok(files);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No files found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching all file metadata: " + e.getMessage());
        }
    }





}
