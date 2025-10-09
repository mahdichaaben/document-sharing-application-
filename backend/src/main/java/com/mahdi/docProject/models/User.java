package com.mahdi.docProject.models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.util.List;

@Document
public class User {

    @Id // Maps MongoDB's _id field to this field
    private String id;  // MongoDB _id field

    private String name;
    private String email;
    private String password;
    private String photoPath;
    private List<Folder> folders;  // One-to-many relationship with Folder

    // No-argument constructor
    public User() {}

    // Constructor with all arguments
    public User(String id, String name, String email, String password, String photoPath, List<Folder> folders) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.photoPath = photoPath;
        this.folders = folders;
    }

    // Constructor with specific fields (name and email)
    public User(String name, String email) {
        this.name = name;
        this.email = email;
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
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }


    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", photoPath='" + photoPath + '\'' +
                '}';
    }
}
