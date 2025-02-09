package com.example.CarListingService.dto;

public class CarFilterDto {
    private String carMake;
    private String carModel;
    private String fuelType;
    private String transmissionType;
    private String bodyType;
    private Integer manufactureYearStart;
    private Long kmsMin;
    private Long kmsMax;
    private Long priceMin;
    private Long priceMax;
    private String vehicleLocation;

    // Getters and Setters

    public CarFilterDto(String carMake, String carModel, String fuelType, String transmissionType, String bodyType, Integer manufactureYearStart, Long kmsMin, Long kmsMax, Long priceMin, Long priceMax, String vehicleLocation) {
        this.carMake = carMake;
        this.carModel = carModel;
        this.fuelType = fuelType;
        this.transmissionType = transmissionType;
        this.bodyType = bodyType;
        this.manufactureYearStart = manufactureYearStart;
        this.kmsMin = kmsMin;
        this.kmsMax = kmsMax;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
        this.vehicleLocation = vehicleLocation;
    }

    public CarFilterDto() {
    }

    public String getCarMake() {
        return carMake;
    }

    public void setCarMake(String carMake) {
        this.carMake = carMake;
    }

    public String getCarModel() {
        return carModel;
    }

    public void setCarModel(String carModel) {
        this.carModel = carModel;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getTransmissionType() {
        return transmissionType;
    }

    public void setTransmissionType(String transmissionType) {
        this.transmissionType = transmissionType;
    }

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public Integer getManufactureYearStart() {
        return manufactureYearStart;
    }

    public void setManufactureYearStart(Integer manufactureYearStart) {
        this.manufactureYearStart = manufactureYearStart;
    }


    public Long getKmsMin() {
        return kmsMin;
    }

    public void setKmsMin(Long kmsMin) {
        this.kmsMin = kmsMin;
    }

    public Long getKmsMax() {
        return kmsMax;
    }

    public void setKmsMax(Long kmsMax) {
        this.kmsMax = kmsMax;
    }

    public Long getPriceMin() {
        return priceMin;
    }

    public void setPriceMin(Long priceMin) {
        this.priceMin = priceMin;
    }

    public Long getPriceMax() {
        return priceMax;
    }

    public void setPriceMax(Long priceMax) {
        this.priceMax = priceMax;
    }

    public String getVehicleLocation() {
        return vehicleLocation;
    }

    public void setVehicleLocation(String vehicleLocation) {
        this.vehicleLocation = vehicleLocation;
    }
}
