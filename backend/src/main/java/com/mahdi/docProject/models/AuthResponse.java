package com.mahdi.docProject.models;

public class AuthResponse {
    private String token;
    private String userName;
    private String email;
    private boolean success;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
// Constructor, getters and setters

    public AuthResponse(String token, String userName, String email, boolean success) {
        this.token = token;
        this.userName = userName;
        this.email = email;
        this.success = success;
    }

    // Getters and setters
}
