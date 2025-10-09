package com.mahdi.docProject.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document
public class Folder {

    @Id
    private String id;
    private String name;
    private String ownerId; // Owner's user ID for the folder
    private List<File> files = new ArrayList<>(); // Files in the folder, initialized as an empty list
    private List<String> share = new ArrayList<>();
    private Date createdAt; // Date when the folder was created
    private Date modifiedAt; // Date when the folder was last modified

    // No-argument constructor
    public Folder() {
        this.createdAt = new Date(); // Set createdAt to current date and time when a new folder is created
        this.modifiedAt = new Date(); // Set modifiedAt to current date and time when a new folder is created
    }

    // Constructor with all arguments
    public Folder(String id, String name, String ownerId, List<File> files) {
        this.id = id;
        this.name = name;
        this.ownerId = ownerId;
        this.files = files != null ? files : new ArrayList<>(); // Ensure the files list is never null
        this.createdAt = new Date(); // Set createdAt to current date and time
        this.modifiedAt = new Date(); // Set modifiedAt to current date and time
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.modifiedAt = new Date(); // Update modifiedAt whenever the name is changed
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public List<File> getFiles() {
        return files;
    }

    public void setFiles(List<File> files) {
        this.files = files != null ? files : new ArrayList<>();
        this.modifiedAt = new Date(); // Update modifiedAt whenever the files list is changed
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    // Method to add a file to the folder
    public void addFile(File file) {
        if (file != null) {
            this.files.add(file);
            this.modifiedAt = new Date(); // Update modifiedAt whenever a file is added
        }
    }

    // Method to share the folder with a user by their user ID
    public void shareWithUser(String userId) {
        if (userId != null && !this.share.contains(userId)) {
            this.share.add(userId);
            this.modifiedAt = new Date(); // Update modifiedAt whenever the folder is shared with a new user
        }
    }

    // Method to unshare the folder with a user by their user ID
    public void unshareWithUser(String userId) {
        if (this.share.remove(userId)) {
            this.modifiedAt = new Date(); // Update modifiedAt whenever the folder is unshared
        }
    }

    // Method to check if the folder is shared with a specific user
    public boolean isSharedWithUser(String userId) {
        return this.share.contains(userId);
    }

    // Method to set shared users
    public void setSharedUsers(List<String> userIds) {
        if (userIds != null) {
            this.share = new ArrayList<>(userIds); // Replace the current list with the new list
            this.modifiedAt = new Date(); // Update modifiedAt when shared users are modified
        }
    }

    public List<String> getSharedUsers() {
        return this.share;
    }

    @Override
    public String toString() {
        return "Folder{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", ownerId='" + ownerId + '\'' +
                ", files=" + files +
                ", createdAt=" + createdAt +
                ", modifiedAt=" + modifiedAt +
                '}';
    }
}
