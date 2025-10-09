package com.mahdi.docProject.repository;
import com.mahdi.docProject.models.File;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface FileRepository extends MongoRepository<File, String> {

    // Find all files belonging to a specific folder by folder ID
    List<File> findByFolderId(String idFolder);

    // Find a file by its ID
    Optional<File> findById(String id);

    // Delete a file by its ID
    void deleteById(String id);

    void deleteByFolderId(String folderId);
}
