package com.example.User_Management.service;

import com.example.User_Management.entity.UserInfo;
import com.example.User_Management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserInfo registerUser(UserInfo userInfo) {
        if (userRepository.existsByEmail(userInfo.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword())); // Encode password
        userInfo.setRole("user"); // Default role
        return userRepository.save(userInfo);
    }
    public List<UserInfo> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserInfo> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public UserInfo updateUser(Long userId, UserInfo updatedUserInfo) {
        return userRepository.findById(userId).map(userInfo -> {
            userInfo.setUsername(updatedUserInfo.getUsername());
            userInfo.setEmail(updatedUserInfo.getEmail());
            userInfo.setPassword(updatedUserInfo.getPassword());
            userInfo.setRole(updatedUserInfo.getRole());
            return userRepository.save(userInfo);
        }).orElseThrow(() -> new IllegalArgumentException("UserInfo not found"));
    }

    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("UserInfo not found");
        }
        userRepository.deleteById(userId);
    }
    public long countAllUsers() {
        return userRepository.count();
    }

    public long countActiveUsers() {
        return userRepository.countByRole("user");
    }

}
