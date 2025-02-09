package com.example.AdminService.controller;


import com.example.AdminService.dto.AdminAnalyticalDto;
import com.example.AdminService.dto.CarDetailDto;
import com.example.AdminService.dto.UserDto;
import com.example.AdminService.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Get all pending cars
    @GetMapping("/cars/pending")
    public List<CarDetailDto> getPendingCars() {
        return adminService.getPendingCarDetails();
    }

    // Approve a car listing
    @PutMapping("/cars/{carId}/approve")
    public ResponseEntity<String> approveCar(@PathVariable Long carId) {
        adminService.approveCar(carId);
        return ResponseEntity.ok("Approved By Admin");
    }

    // Reject a car listing
    @PutMapping("/cars/{carId}/reject")
    public void rejectCar(@PathVariable Long carId) {
        adminService.rejectCar(carId);
    }

    // Get all active users
    @GetMapping("/users/active")
    public List<UserDto> getAllUsers() {
        return adminService.getAllUsers();
    }

    // Change user role
    @PutMapping("/users/{userId}/role")
    public void changeUserRole(@PathVariable Long userId, @RequestParam String role) {
        adminService.changeUserRole(userId, role);
    }

    @DeleteMapping("/car/{carId}")
    public ResponseEntity<Void> deleteCarDetail(@PathVariable Long carId) {
        // Call the service method to delete the car detail
        adminService.deleteCarDetail(carId);

        // Return a response indicating the car was deleted
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/analytics")
    public AdminAnalyticalDto getAdminAnalytics() {
        return adminService.getAnalytics();
    }


}
