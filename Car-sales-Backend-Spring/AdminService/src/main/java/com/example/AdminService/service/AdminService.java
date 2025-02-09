package com.example.AdminService.service;


import com.example.AdminService.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String CAR_SERVICE_URL = "http://localhost:8082/cars";
    private static final String USER_SERVICE_URL = "http://localhost:8081/users";
    private static final String BOOKING_SERVICE_URL = "http://localhost:8085/bookings";


    // Fetch pending car details from Car Service
    public List<CarDetailDto> getPendingCarDetails() {
        return restTemplate.getForObject(CAR_SERVICE_URL + "/status/PENDING", List.class);
    }

    // Approve a car by updating its status in the Car Service
    public void approveCar(Long carId) {
        restTemplate.put(CAR_SERVICE_URL + "/" + carId + "/approve", null);
    }

    // Reject a car by updating its status in the Car Service
    public void rejectCar(Long carId) {
        restTemplate.put(CAR_SERVICE_URL + "/" + carId + "/reject", null);
    }

    // Fetch all active users from User Service
    public List<UserDto> getAllUsers() {
        return restTemplate.getForObject(USER_SERVICE_URL + "/active", List.class);
    }

    // Change a user's role in the User Service
    public void changeUserRole(Long userId, String role) {
        restTemplate.put(USER_SERVICE_URL + "/" + userId + "/role?role=" + role, null);
    }

    public void deleteCarDetail(Long carId) {
        try {
            // Make a call to the Car Service to delete the car by its ID
            restTemplate.delete(CAR_SERVICE_URL + "/" + carId);
            System.out.println("Car with ID " + carId + " deleted successfully.");
        } catch (Exception e) {
            // Handle error (log it, rethrow it, etc.)
            System.out.println("Error deleting car: " + e.getMessage());
        }
    }

    public AdminAnalyticalDto getAnalytics() {
        AdminAnalyticalDto analytics = new AdminAnalyticalDto();

        // Fetch aggregated data from the Car Service
        AnalyticsDto carAnalytics = restTemplate.getForObject(CAR_SERVICE_URL + "/analytics", AnalyticsDto.class);
        analytics.setTotalCarsListed(carAnalytics.getTotalCars());
        analytics.setPendingCarListings(carAnalytics.getPendingCars());
        analytics.setCarsSold(carAnalytics.getSoldCars());
        analytics.setTopSellingCar(carAnalytics.getTopSellingCar());
        analytics.setBiddingEnabledCount(carAnalytics.getBiddingEnabledCount());

        // Fetch user data
        UserAnalyticsDto userAnalytics = restTemplate.getForObject(USER_SERVICE_URL + "/analytics", UserAnalyticsDto.class);
        analytics.setTotalUsers(userAnalytics.getTotalUsers());
        analytics.setActiveUsers(userAnalytics.getActiveUsers());

        // Fetch booking data
        BookingAnalyticsDto bookingAnalytics = restTemplate.getForObject(BOOKING_SERVICE_URL + "/analytics", BookingAnalyticsDto.class);
        analytics.setTotalBookings(bookingAnalytics.getTotalBookings());
        analytics.setActiveBookings(bookingAnalytics.getActiveBookings());

        return analytics;
    }

}
