package com.mahdi.docProject.services.interfaces;

import com.mahdi.docProject.models.File;
import com.mahdi.docProject.models.Folder;


import com.mahdi.docProject.models.Folder;

import java.util.List;

public interface FolderService {

    // Create a new folder
    Folder createFolder(String token, String name);

    // Update folder name
    Folder updateFolderName(String folderId, String newName, String token);

    // Delete a folder
    void deleteFolder(String folderId, String token);

    Folder getFolderById(String folderId, String token);


    List<Folder> getFoldersByOwnerId(String token);


    Folder removeFileFromFolder(String folderId, String fileId);


    Folder addFileToFolder(String folderId, File file);


    Folder shareFolder(String folderId, List<String> userIds);


    List<String> getSharedEmailsForFolder(String folderId);


    List<String> getNotSharedEmailsForFolder(String folderId);


    List<Folder> getFoldersSharedWithUser(String token);

}