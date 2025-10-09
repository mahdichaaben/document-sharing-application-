package com.mahdi.docProject.services.impl;

import com.mahdi.docProject.models.User;
import com.mahdi.docProject.models.UserPrincipal;
import com.mahdi.docProject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Directly use the Optional returned by findByEmail
        Optional<User> userOptional = userRepository.findByEmail(username);

        User user = userOptional.orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new UserPrincipal(user);  // Create UserPrincipal with the actual User object
    }
}