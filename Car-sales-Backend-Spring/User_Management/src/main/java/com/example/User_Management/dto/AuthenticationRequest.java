package com.example.User_Management.dto;

public class AuthenticationRequest {
    private String email;
    private String Password;

    public AuthenticationRequest(String email, String password) {
        this.email = email;
        Password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public AuthenticationRequest() {
    }
}