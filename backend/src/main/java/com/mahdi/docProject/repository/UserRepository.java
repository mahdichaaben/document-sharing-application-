package com.mahdi.docProject.repository;

import com.mahdi.docProject.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    // Find a user by their email
    Optional<User> findByEmail(String email);

    // Find a user by their id (if needed)
    Optional<User> findById(String id);

    // Delete a user by their email
    void deleteByEmail(String email);
}