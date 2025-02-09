package com.example.User_Management.dto;

public class UserAnalyticsDto {
    private long totalUsers;
    private long activeUsers;

    public UserAnalyticsDto(long totalUsers, long activeUsers) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
    }

    public UserAnalyticsDto() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }
}
