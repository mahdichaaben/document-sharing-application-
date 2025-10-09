package com.mahdi.docProject.controllers;

import com.mahdi.docProject.models.Folder;
import com.mahdi.docProject.services.interfaces.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    @Autowired
    private FolderService folderService;

    // Helper method to extract the token
    private String extractToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;  // Invalid or missing token
        }
        return authorizationHeader.substring(7);  // Extract the token by removing "Bearer " prefix
    }

    // Create a new folder
    @PostMapping("/create")
    public ResponseEntity<?> createFolder(
            @RequestBody Folder folder,
            HttpServletRequest request) {
        try {
            String token = extractToken(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid"); // 401 Unauthorized
            }

            Folder newFolder = folderService.createFolder(token, folder.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(newFolder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating folder: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }


    @GetMapping("/{folderId}")
    public ResponseEntity<?> getByFolderId(
            @PathVariable String folderId,
            HttpServletRequest request) {

        try {
            // Debug: Print received folderId
            System.out.println("Received request to get folder by ID: " + folderId);

            // Extract the token from the request
            String token = extractToken(request);

            // Debug: Print extracted token
            System.out.println("Extracted token: " + token);

            // Handle case where token is missing or invalid
            if (token == null) {
                System.out.println("Authorization token is missing or invalid");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization token is missing or invalid"); // 401 Unauthorized
            }

            // Call the service method to get the folder by ID
            Folder folder = folderService.getFolderById(folderId, token);

            // Debug: Print the found folder
            System.out.println("Folder found: " + folder);

            // Return the folder if found
            return ResponseEntity.ok(folder);

        } catch (RuntimeException e) {
            // Handle any exceptions and send an appropriate response
            System.out.println("Error fetching folder: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error fetching folder: " + e.getMessage());
        } catch (Exception e) {
            // Handle any unexpected exceptions
            System.out.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }


    @PutMapping("/rename")
    public ResponseEntity<?> updateFolderName(
            @RequestParam String folderId,
            @RequestParam String newName,  // Using query parameter
            HttpServletRequest request) {
        try {
            // Extracting the token from the request
            String token = extractToken(request);
            System.out.println("Extracted Token: " + token); // Debugging token extraction

            if (token == null) {
                System.out.println("Token is missing or invalid"); // Debugging missing token
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization token is missing or invalid");
            }

            System.out.println("Updating folder with ID: " + folderId + " to new name: " + newName); // Debugging folderId and newName

            // Call the service method to update folder name
            Folder updatedFolder = folderService.updateFolderName(folderId, newName, token);
            System.out.println("Updated Folder: " + updatedFolder); // Debugging the updated folder

            // Return the updated folder
            return ResponseEntity.ok(updatedFolder);

        } catch (RuntimeException e) {
            // Catching any runtime exceptions and returning appropriate response
            System.out.println("Error updating folder: " + e.getMessage()); // Debugging exception message
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating folder: " + e.getMessage());
        } catch (Exception e) {
            // Catching unexpected exceptions and logging them
            System.out.println("Unexpected error: " + e.getMessage()); // Debugging unexpected error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }


    // Delete folder by ID
    @DeleteMapping("/{folderId}")
    public ResponseEntity<?> deleteFolder(@PathVariable String folderId, HttpServletRequest request) {
        try {
            String token = extractToken(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid");
            }

            // Log for debugging
            System.out.println("Deleting folder with ID: " + folderId);

            folderService.deleteFolder(folderId, token);
            return ResponseEntity.noContent().build(); // 204 No Content

        } catch (RuntimeException e) {
            System.out.println("Error deleting folder: " + e.getMessage()); // Debugging error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error deleting folder: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage()); // Debugging unexpected error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }


    @GetMapping("/owner")
    public ResponseEntity<?> getFoldersByOwnerId(HttpServletRequest request) {
        try {
            // Extract the token from the request
            String token = extractToken(request);

            // Handle case where token is missing or invalid
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization token is missing or invalid");
            }

            // Call the service to get folders by the current user's ID
            List<Folder> folders = folderService.getFoldersByOwnerId(token);

            // Return the list of folders if found
            return ResponseEntity.ok(folders);

        } catch (RuntimeException e) {
            // Handle any exceptions and send an appropriate response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error fetching folders: " + e.getMessage());
        } catch (Exception e) {
            // Handle any unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }






    @GetMapping("/sharedwithuser")
    public ResponseEntity<?> getFoldersSharedWithUser(HttpServletRequest request) {
        try {
            // Extract the token from the request
            String token = extractToken(request);

            // Handle case where token is missing or invalid
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authorization token is missing or invalid");
            }

            // Call the service to get folders shared with the current user
            List<Folder> folders = folderService.getFoldersSharedWithUser(token);

            // Return the list of folders if found
            return ResponseEntity.ok(folders);

        } catch (RuntimeException e) {
            // Handle any exceptions and send an appropriate response
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error fetching folders: " + e.getMessage());
        } catch (Exception e) {
            // Handle any unexpected exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }



    @PutMapping("/{folderId}/share")
    public ResponseEntity<?> shareFolder(@PathVariable String folderId,
                                         @RequestBody List<String> usersEmails,
                                         HttpServletRequest request) {
        try {
            // Extract the token from the request
            String token = extractToken(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid");
            }


            System.out.println("Updating folder with ID: " + folderId + " to share users: " + usersEmails);

            // Call the service method to share the folder with the given user IDs
            Folder updatedFolder = folderService.shareFolder(folderId, usersEmails);

            return ResponseEntity.ok(updatedFolder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error sharing folder: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }


    }


    @GetMapping("/{folderId}/sharedwith")
    public ResponseEntity<?> sharedwith(@PathVariable String folderId,
                                        HttpServletRequest request) {
        try {
            // Extract the token from the request
            String token = extractToken(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid");
            }

            // Call service to get emails of shared users
            List<String> emails = folderService.getSharedEmailsForFolder(folderId);

            return ResponseEntity.ok(emails);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error sharing folder: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }


    @GetMapping("/{folderId}/notsharedwith")
    public ResponseEntity<?> notsharedwith(@PathVariable String folderId,
                                           HttpServletRequest request) {
        try {
            // Extract the token from the request
            String token = extractToken(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization token is missing or invalid");
            }

            // Call service to get emails of users not shared with the folder
            List<String> emails = folderService.getNotSharedEmailsForFolder(folderId);

            return ResponseEntity.ok(emails);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching non-shared users: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }









}


