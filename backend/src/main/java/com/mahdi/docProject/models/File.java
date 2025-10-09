package com.mahdi.docProject.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
public class File {

    @Id
    private String id;
    private String name;
    private String fileType;
    private String folderId;
    private String fileUrl;
    private String fileExtension;

    // Field to store unique file name
    private String uniqueFileName;

    // Field to store the creation timestamp of the file
    private Date createdAt;

    // No-argument constructor
    public File() {
        this.createdAt = new Date(); // Set createdAt to the current date and time when a new file is created
    }

    // Constructor with all arguments
    public File(String id, String name, String fileType, String folderId, String fileUrl, String fileExtension) {
        this.id = id;
        this.name = name;
        this.fileType = fileType;
        this.folderId = folderId;
        this.fileUrl = fileUrl;
        this.fileExtension = fileExtension;
        this.createdAt = new Date(); // Set createdAt to the current date and time
        this.uniqueFileName = generateUniqueFileName(id, fileExtension);  // Generate the unique file name based on id and extension
    }

    // Getter and Setter methods
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
        this.uniqueFileName = generateUniqueFileName(id, this.fileExtension);  // Re-generate unique file name if id changes
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFolderId() {
        return folderId;
    }

    public void setFolderId(String folderId) {
        this.folderId = folderId;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileExtension() {
        return fileExtension;
    }

    public void setFileExtension(String fileExtension) {
        this.fileExtension = fileExtension;
        this.uniqueFileName = generateUniqueFileName(this.id, fileExtension);  // Re-generate unique file name if extension changes
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    // Getter for uniqueFileName (no setter, since it’s derived from id and fileExtension)
    public String getUniqueFileName() {
        return uniqueFileName;
    }

    public void setUniqueFileName() {
        this.uniqueFileName = generateUniqueFileName(id, fileExtension); // Re-generate unique file name
    }

    // Method to generate unique file name (id + extension)
    private String generateUniqueFileName(String id, String fileExtension) {
        return id + fileExtension;
    }

    @Override
    public String toString() {
        return "File{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", fileType='" + fileType + '\'' +
                ", folderId='" + folderId + '\'' +
                ", fileUrl='" + fileUrl + '\'' +
                ", fileExtension='" + fileExtension + '\'' +
                ", uniqueFileName='" + uniqueFileName + '\'' +
                ", createdAt=" + createdAt + // Include createdAt in the toString
                '}';
    }
}
