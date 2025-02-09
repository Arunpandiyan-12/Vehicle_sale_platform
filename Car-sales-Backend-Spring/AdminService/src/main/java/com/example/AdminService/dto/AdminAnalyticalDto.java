package com.example.AdminService.dto;

import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

public class AdminAnalyticalDto {
    private long totalUsers;
    private long totalCarsListed;
    private long pendingCarListings;
    private long carsSold;
    private List<CarDetailDto> topSellingCar;
    private long biddingEnabledCount;
    private long totalBookings;
    private long activeUsers;

    public long getActiveBookings() {
        return activeBookings;
    }

    public void setActiveBookings(long activeBookings) {
        this.activeBookings = activeBookings;
    }

    private long activeBookings;

    public AdminAnalyticalDto() {
    }

    public AdminAnalyticalDto(long activeUsers, long activeBookings) {
        this.activeUsers = activeUsers;
        this.activeBookings = activeBookings;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    // Getters and Setters
    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCarsListed() {
        return totalCarsListed;
    }

    public void setTotalCarsListed(long totalCarsListed) {
        this.totalCarsListed = totalCarsListed;
    }

    public long getPendingCarListings() {
        return pendingCarListings;
    }

    public void setPendingCarListings(long pendingCarListings) {
        this.pendingCarListings = pendingCarListings;
    }

    public long getCarsSold() {
        return carsSold;
    }

    public void setCarsSold(long carsSold) {
        this.carsSold = carsSold;
    }

    public List<CarDetailDto> getTopSellingCar() {
        return topSellingCar;
    }

    public void setTopSellingCar(List<CarDetailDto> topSellingCar) {
        this.topSellingCar = topSellingCar;
    }

    public long getBiddingEnabledCount() {
        return biddingEnabledCount;
    }

    public void setBiddingEnabledCount(long biddingEnabledCount) {
        this.biddingEnabledCount = biddingEnabledCount;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }
}
