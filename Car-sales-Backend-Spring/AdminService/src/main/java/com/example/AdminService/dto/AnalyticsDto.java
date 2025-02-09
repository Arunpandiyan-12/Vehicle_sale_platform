package com.example.AdminService.dto;


import java.util.List;

public class AnalyticsDto {
    private long totalCars;
    private long pendingCars;
    private long soldCars;
    private List<CarDetailDto> topSellingCar;
    private long biddingEnabledCount;

    // Getters and Setters

    public AnalyticsDto(long totalCars, long pendingCars, long soldCars, List<CarDetailDto> topSellingCar, long biddingEnabledCount) {
        this.totalCars = totalCars;
        this.pendingCars = pendingCars;
        this.soldCars = soldCars;
        this.topSellingCar = topSellingCar;
        this.biddingEnabledCount = biddingEnabledCount;
    }

    public AnalyticsDto() {
    }

    public long getTotalCars() {
        return totalCars;
    }

    public void setTotalCars(long totalCars) {
        this.totalCars = totalCars;
    }

    public long getPendingCars() {
        return pendingCars;
    }

    public void setPendingCars(long pendingCars) {
        this.pendingCars = pendingCars;
    }

    public long getSoldCars() {
        return soldCars;
    }

    public void setSoldCars(long soldCars) {
        this.soldCars = soldCars;
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
}