package com.example.BookingService.dto;

public class BookingAnalyticsDto {
    private long totalBookings;
    private long activeBookings;

    // Getters and Setters

    public BookingAnalyticsDto(long totalBookings, long activeBookings) {
        this.totalBookings = totalBookings;
        this.activeBookings = activeBookings;
    }

    public BookingAnalyticsDto() {
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getActiveBookings() {
        return activeBookings;
    }

    public void setActiveBookings(long activeBookings) {
        this.activeBookings = activeBookings;
    }
}
