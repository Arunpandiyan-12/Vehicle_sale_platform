package com.example.BookingService.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDTO {
    private Long userId;
    @JsonProperty("username")
    private String name;
    private String email;

    public UserDTO() {
    }

    public UserDTO(Long userId, String name, String email) {
        this.userId = userId;
        this.name = name;
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
