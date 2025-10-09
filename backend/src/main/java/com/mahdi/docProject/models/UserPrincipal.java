package com.mahdi.docProject.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Assuming user has a role stored in a field or you want to return both roles
        // Replace this with the actual check for roles in your User model (if needed)

        // For example:
        // if (user is admin) return ROLE_ADMIN
        // else return ROLE_USER

        return Arrays.asList(
                new SimpleGrantedAuthority("ROLE_ADMIN") // Add both roles
        );
    }

    @Override
    public String getPassword() {
        return user.getPassword(); // Retrieve the password from the User object
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // Username is typically the email in this case
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // You can implement logic here for account expiration
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // You can implement logic here for account lock status
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Implement logic for credential expiration if necessary
    }

    @Override
    public boolean isEnabled() {
        return true; // Implement logic for whether the account is enabled
    }

    // Getter for the user object (if needed elsewhere)
    public User getUser() {
        return user;
    }

    // You can override `toString()` or `equals()` methods if necessary for logging or comparison.
}
