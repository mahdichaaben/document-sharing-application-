package com.mahdi.docProject.services.impl;

import com.mahdi.docProject.models.AuthResponse;
import com.mahdi.docProject.models.User;
import com.mahdi.docProject.repository.UserRepository;
import com.mahdi.docProject.services.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    // Create a new user
    @Override
    public User createUser(User user) {
        // Hash the password before saving the user
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Retrieve all users
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Retrieve a user by ID
    @Override
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    // Register a new user
    @Override
    public User registerUser(String email, String password) {
        // Check if the user already exists by email
        Optional<User> userOptional = userRepository.findByEmail(email);  // Directly get the Optional

        if (userOptional.isPresent()) {
            // Throw an exception if the user already exists
            throw new RuntimeException("User already exists with this email");
        }

        // If the user doesn't exist, create a new user and hash the password
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(encoder.encode(password));  // Hash the password
        return userRepository.save(newUser);  // Save the new user to the repository
    }

    @Override
    public AuthResponse verify(User user) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(user.getEmail());
            return new AuthResponse(token, user.getName(), user.getEmail(), true); // Return success response
        } else {
            return new AuthResponse(null, null, null, false); // Return failure response
        }
    }

    // Update an existing user
    @Override
    public User updateUser(String id, User user) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setName(user.getName());
                    existingUser.setEmail(user.getEmail());
                    existingUser.setPassword(encoder.encode(user.getPassword()));  // Hash the new password
                    existingUser.setPhotoPath(user.getPhotoPath());
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    // Delete a user by ID
    @Override
    public void deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }

    @Override
    public AuthResponse getUserFromToken(String token) {
        // Use JWTService to extract the email (username) from the token
        String email = jwtService.extractUserName(token);
        User authenticatedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return new AuthResponse(token, authenticatedUser.getName(), authenticatedUser.getEmail(), true);
    }

    // Retrieve a user by email
    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Override
    public void logout(String token) {
        // Call the JWTService to invalidate the token
        jwtService.invalidateToken(token);

        // Log the event (optional)
        System.out.println("User has been logged out: " + token);
    }




    @Override
    public User getUserInfo(String token){


        String email = jwtService.extractUserName(token);
        User authenticatedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));


        return authenticatedUser;
    }



    @Override
    public void updatePassword(String token, String oldPassword, String newPassword) {
        // Extract the email from the token
        String email = jwtService.extractUserName(token);

        // Retrieve the authenticated user by email
        User authenticatedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Authenticate the user with the old password
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticatedUser.getEmail(), oldPassword)
        );

        // If authentication is successful, update the password
        if (authentication.isAuthenticated()) {
            // Hash the new password
            String encodedNewPassword = encoder.encode(newPassword);

            // Update the user's password
            authenticatedUser.setPassword(encodedNewPassword);
            userRepository.save(authenticatedUser);
        } else {
            // Throw an exception if the old password doesn't match
            throw new RuntimeException("The old password doesn't match");
        }
    }




    @Override
    public User updateUserInfo(String token, User user) {

        String email = jwtService.extractUserName(token);

        // Retrieve the authenticated user by email
        User authenticatedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        authenticatedUser.setName(user.getName());

        return userRepository.save(authenticatedUser);

    }



    @Override

    public void updatePhoto(String token,String photoUrl){
        String email = jwtService.extractUserName(token);


        User authenticatedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        authenticatedUser.setPhotoPath(photoUrl);

        userRepository.save(authenticatedUser);


    }


}
