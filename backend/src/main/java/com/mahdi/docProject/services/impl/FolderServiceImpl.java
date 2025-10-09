package com.mahdi.docProject.services.impl;

import com.mahdi.docProject.models.File;
import com.mahdi.docProject.models.Folder;
import com.mahdi.docProject.models.User;
import com.mahdi.docProject.repository.FileRepository;
import com.mahdi.docProject.repository.FolderRepository;
import com.mahdi.docProject.repository.UserRepository;
import com.mahdi.docProject.services.interfaces.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FolderServiceImpl implements FolderService {

    @Autowired
    private FolderRepository folderRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;




    // Create a new folder
    @Override
    public Folder createFolder(String token, String name) {
        // Extract user information from the JWT token
        String curEmail = jwtService.extractUserName(token);
        User user = userRepository.findByEmail(curEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String ownerId = user.getId();

        // Check if folder with same name exists for the user
        if (folderRepository.existsByOwnerIdAndName(ownerId, name)) {
            throw new RuntimeException("Folder name must be unique for this user");
        }

        // Create and save the new folder
        Folder newFolder = new Folder();
        newFolder.setName(name);
        newFolder.setOwnerId(ownerId);

        return folderRepository.save(newFolder);
    }

    // Update folder name
    @Override
    public Folder updateFolderName(String folderId, String newName, String token) {
        String curEmail = jwtService.extractUserName(token);
        User user = userRepository.findByEmail(curEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        // Validate ownership
        if (!folder.getOwnerId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You are not the owner of this folder");
        }

        // Check if new name is unique for the user
        if (folderRepository.existsByOwnerIdAndName(folder.getOwnerId(), newName)) {
            throw new RuntimeException("Folder name must be unique for this user");
        }

        // Update folder name
        folder.setName(newName);
        return folderRepository.save(folder);
    }

    // Delete a folder
    @Override
    public void deleteFolder(String folderId, String token) {
        String curEmail = jwtService.extractUserName(token);
        User user = userRepository.findByEmail(curEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));







        // Validate ownership
        if (!folder.getOwnerId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You are not the owner of this folder");
        }

        // Delete files associated with the folder

        fileRepository.deleteByFolderId(folderId);

        // Finally, delete the folder itself
        folderRepository.delete(folder);
    }



    @Override
    public Folder getFolderById(String folderId, String token) {
        String curEmail = jwtService.extractUserName(token);
        User user = userRepository.findByEmail(curEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        if (!folder.getOwnerId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You are not the owner of this folder");
        }

        return folder;
    }



    public Folder addFileToFolder(String folderId, File file) {
        // Find the folder by ID
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

        // Add the file to the folder's files list
        folder.getFiles().add(file);  // Assuming files is a list in Folder model

        // Save the updated folder back to the database
        return folderRepository.save(folder);
    }




    public Folder removeFileFromFolder(String folderId, String fileId) {
        // Find the folder by ID
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

        // Remove the file from the folder's files list
        folder.getFiles().removeIf(file -> file.getId().equals(fileId));

        // Save the updated folder back to the database
        return folderRepository.save(folder);
    }


    public List<Folder> getFoldersByOwnerId(String token) {
        // Extract user information from the JWT token
        String curEmail = jwtService.extractUserName(token);
        User user = userRepository.findByEmail(curEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return folderRepository.findByOwnerId(user.getId());
    }







    public Folder shareFolder(String folderId, List<String> emails) {
        // Find the folder by ID, throw exception if not found
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

        // Remove duplicates by converting the list to a set

        Set<String> uniqueUserIds = new HashSet<>();


        for (String userEmail : emails) {
            Optional<User> user = userRepository.findByEmail(userEmail);


            if (user.isEmpty()) {
                throw new RuntimeException("User with " + userEmail + " not found");
            }else{
                uniqueUserIds.add(user.get().getId());
            }
        }




        // Check if all userIds exist in the UserRepository


        // Set the shared users list without duplicates
        folder.setSharedUsers(List.copyOf(uniqueUserIds));

        // Save the updated folder back to the repository
        return folderRepository.save(folder);
    }



    public List<String> getSharedEmailsForFolder(String folderId) {
        // Find the folder by ID
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

        // Create a list to hold emails
        List<String> emails = new ArrayList<>();

        // Fetch the email of each user by their ID
        for (String userId : folder.getSharedUsers()) {
            Optional<User> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                throw new RuntimeException("User with ID " + userId + " not found");
            }
            // Add user's email to the list
            emails.add(user.get().getEmail());
        }

        // Return the list of emails
        return emails;
    }





    public List<String> getNotSharedEmailsForFolder(String folderId) {
        // Find the folder by ID
        Folder folder = folderRepository.findById(folderId).orElseThrow(() -> new RuntimeException("Folder not found"));

        // Create a list to hold emails of users who are not shared with the folder
        List<String> emails = new ArrayList<>();

        // Fetch all users (or you can customize this to fetch users from a specific group)
        List<User> allUsers = userRepository.findAll();  // This fetches all users, adjust as needed

        // Check each user if their ID is not in the sharedUsers list of the folder
        for (User user : allUsers) {
            if (!folder.getSharedUsers().contains(user.getId())) {
                // Add user's email to the list if they are not shared with the folder
                emails.add(user.getEmail());
            }
        }

        // Return the list of emails
        return emails;
    }


    public List<Folder> getFoldersSharedWithUser(String token){
        String curEmail = jwtService.extractUserName(token);

        User user = userRepository.findByEmail(curEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Folder> foldersshared=folderRepository.findByShare(user.getId());


        return foldersshared;
    }



}
