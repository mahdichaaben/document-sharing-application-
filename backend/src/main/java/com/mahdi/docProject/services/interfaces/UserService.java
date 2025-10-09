package com.mahdi.docProject.services.interfaces;

import com.mahdi.docProject.models.AuthResponse;
import com.mahdi.docProject.models.User;

import java.util.List;

public interface UserService {
    // Basic CRUD operations
    User createUser(User user);                     // Create a new user

    List<User> getAllUsers();                       // Get all users

    User getUserById(String id);                    // Find user by ID

    User updateUser(String id, User user);          // Update user details

    void deleteUser(String id);                     // Delete user by ID

    // Additional methods based on repository
    User getUserByEmail(String email);              // Find user by email

    User registerUser(String email, String password); // Register a new user

    AuthResponse verify(User user);                 // Verify user credentials

    AuthResponse getUserFromToken(String token);


    // Retrieve user info from token

    void logout(String token);


    User getUserInfo(String token);



    void updatePassword(String token, String oldPassword, String newPassword);


    User updateUserInfo(String token, User user);


    void updatePhoto(String token,String photoUrl);

}
