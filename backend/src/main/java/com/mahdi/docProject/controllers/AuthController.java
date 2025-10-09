package com.mahdi.docProject.controllers;

import com.mahdi.docProject.models.AuthResponse;
import com.mahdi.docProject.models.PasswordUpdateRequest;
import com.mahdi.docProject.models.User;
import com.mahdi.docProject.services.interfaces.UserService;
import com.mahdi.docProject.storage.StorageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;


    @Autowired
    private final StorageService storageService;

    @Autowired
    public AuthController(StorageService storageService) {
        this.storageService = storageService;
    }

    // Get Session ID
    @GetMapping
    public ResponseEntity<String> getSessionId(HttpServletRequest request) {
        return ResponseEntity.ok("hi " + request.getSession().getId());
    }

    // Register a user
    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Register the user
            User createdUser = userService.registerUser(user.getEmail(), user.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser); // 201 Created

        } catch (Exception e) {
            // Handle "User already exists" case with specific status
            if (e.getMessage().contains("User already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists with this email"); // 409 Conflict
            }
            // Handle other errors with a 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage()); // 400 Bad Request
        }
    }

    // Login user
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            AuthResponse authResponse = userService.verify(user); // Call the verify method from UserService

            if (authResponse.isSuccess()) {
                return ResponseEntity.ok(authResponse); // 200 OK with the token
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: Invalid credentials"); // 401 Unauthorized
            }
        } catch (Exception e) {
            // Catch generic exceptions and return a 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal error occurred during login: " + e.getMessage()); // 500 Internal Server Error
        }
    }

    // Get user data from token
    @GetMapping("user")
    public ResponseEntity<?> getUserFromToken(HttpServletRequest request) {
        // Extract token from the Authorization header (Bearer <token>)
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid"); // 401 Unauthorized
        }

        String token = authorizationHeader.substring(7);  // Extract the token by removing "Bearer " prefix
        try {
            // Call the userService to fetch user data from the token
            AuthResponse authResponse = userService.getUserFromToken(token);
            return ResponseEntity.ok(authResponse);  // 200 OK with the user data
        } catch (RuntimeException e) {
            // Handle any errors that occur during token validation or user retrieval
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error fetching user from token: " + e.getMessage()); // 401 Unauthorized
        }
    }

    // Logout user
    @GetMapping("logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid"); // 401 Unauthorized
            }

            String token = authorizationHeader.substring(7);

            // Call the userService to logout and invalidate the token
            userService.logout(token);

            // Clear any session cookies if necessary
            response.setHeader("Set-Cookie", "authToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");

            return ResponseEntity.ok("Logout successful"); // 200 OK
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during logout: " + e.getMessage()); // 500 Internal Server Error
        }
    }





    @PutMapping("updatepassword")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest passwordUpdateRequest, HttpServletRequest request) {
        try {
            // Extract the token from the Authorization header
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid");
            }

            String token = authorizationHeader.substring(7);

            // Call the service to update the password
            userService.updatePassword(token, passwordUpdateRequest.getOldPassword(), passwordUpdateRequest.getNewPassword());

            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException ex) {
            // Return an error response if an exception is thrown
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            // Handle unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the password");
        }
    }






    @GetMapping("userinfo")
    public ResponseEntity<?> userInfo(HttpServletRequest request) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid"); // 401 Unauthorized
            }

            String token = authorizationHeader.substring(7);

            User uuser=userService.getUserInfo(token);

            return ResponseEntity.ok(uuser); // 200 OK
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during logout: " + e.getMessage()); // 500 Internal Server Error
        }
    }



    @PutMapping("userinfo")
    public ResponseEntity<?> userInfo(HttpServletRequest request, @RequestBody User upadteduser) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid"); // 401 Unauthorized
            }

            String token = authorizationHeader.substring(7);

            User user=userService.updateUserInfo(token,upadteduser);

            return ResponseEntity.ok(user); // 200 OK
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during logout: " + e.getMessage()); // 500 Internal Server Error
        }
    }




    @PutMapping("userphoto")
    public ResponseEntity<?> userPhoto(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
        try {
            // Extract the token from the Authorization header
            String authorizationHeader = request.getHeader("Authorization");
            System.out.println("Authorization Header: " + authorizationHeader); // Debug: Print the header

            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                System.out.println("Authorization token is missing or invalid"); // Debug: Invalid token case
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid");
            }

            String token = authorizationHeader.substring(7);  // Extract token by removing "Bearer " prefix
            System.out.println("Extracted Token: " + token); // Debug: Print the extracted token

            // Validate file
            if (file.isEmpty()) {
                System.out.println("No file uploaded"); // Debug: File is empty
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded");
            }

            // Extract file metadata
            String fileName = file.getOriginalFilename();
            long fileSize = file.getSize();
            String contentType = file.getContentType();
            String fileExtension = fileName.substring(fileName.lastIndexOf("."));

            System.out.println("File Metadata: ");
            System.out.println("File Name: " + fileName); // Debug: Print file name
            System.out.println("File Size: " + fileSize); // Debug: Print file size
            System.out.println("Content Type: " + contentType); // Debug: Print content type
            System.out.println("File Extension: " + fileExtension); // Debug: Print file extension

            // Generate a unique file name (e.g., using UUID)
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            System.out.println("Generated Unique File Name: " + uniqueFileName); // Debug: Print generated file name

            // Store the file using the storage service
            System.out.println("Storing the file..."); // Debug: Storing file
            storageService.store(file, uniqueFileName);

            // Get the URL for the uploaded file
            String fileUrl = storageService.loadUrl(uniqueFileName);
            System.out.println("File URL: " + fileUrl); // Debug: Print the file URL

            // Update the user's photo URL in the database
            System.out.println("Updating user's photo URL in the database..."); // Debug: Before database update
            userService.updatePhoto(token, fileUrl);

            // Return success response
            System.out.println("Photo updated successfully"); // Debug: Success
            return ResponseEntity.ok("Photo updated successfully");

        } catch (Exception e) {
            // Handle unexpected errors
            System.out.println("Error occurred: " + e.getMessage()); // Debug: Error message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating photo: " + e.getMessage());
        }
    }


}
