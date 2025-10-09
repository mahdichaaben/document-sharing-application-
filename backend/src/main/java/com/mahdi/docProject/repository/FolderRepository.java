package com.mahdi.docProject.repository;

import com.mahdi.docProject.models.Folder;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface FolderRepository extends MongoRepository<Folder, String> {

    List<Folder> findByOwnerId(String ownerId);

    Optional<Folder> findById(String id);

    void deleteById(String id);

    boolean existsByOwnerIdAndName(String ownerId, String name);

    List<Folder> findByShare(String userId);



}
