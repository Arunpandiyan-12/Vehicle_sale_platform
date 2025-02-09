package com.example.CarDetails.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class CarDetailDto {
    private Long id;
    private String registrationNumber;
    private String ownerName;
    private String carMake;
    private String carModel;
    private String variant;
    private int manufactureYear;
    private Long kms;
    private String bodyType;
    private int numberOfOwners;
    private String fuelType;
    private String transmissionType;
    private String vehicleLocation;
    private String vin;
    private Long expectedPrice;
    private String description;
    private List<String> imageUrls;
    private String status; // e.g., "PENDING", "ACCEPTED", "REJECTED"
    private Long userId;
    private boolean biddingAllowed;
    private boolean isSold; // New field to track sold status
    @JsonProperty("bookingCount")
    private long bookingCount;
    @JsonProperty("isSold")
    public boolean isSold() {
        return isSold;
    }

    public void setSold(boolean sold) {
        isSold = sold;
    }

    public long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(long bookingCount) {
        this.bookingCount = bookingCount;
    }

    // Getters and Setters
    public CarDetailDto() {
    }

    public CarDetailDto(Long id, String registrationNumber, String ownerName, String carMake, String carModel, String variant, int manufactureYear, Long kms, String bodyType, int numberOfOwners, String fuelType, String transmissionType, String vin, Long expectedPrice, String description, List<String> imageUrls, String status, Long userId, boolean biddingAllowed, String vehicleLocation, boolean isSold, long bookingCount) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.ownerName = ownerName;
        this.carMake = carMake;
        this.carModel = carModel;
        this.variant = variant;
        this.manufactureYear = manufactureYear;
        this.kms = kms;
        this.bodyType = bodyType;
        this.numberOfOwners = numberOfOwners;
        this.fuelType = fuelType;
        this.transmissionType = transmissionType;
        this.vehicleLocation = vehicleLocation;
        this.vin = vin;
        this.expectedPrice = expectedPrice;
        this.description = description;
        this.imageUrls = imageUrls;
        this.status = status;
        this.userId = userId;
        this.biddingAllowed = biddingAllowed;
        this.isSold = isSold;

        this.bookingCount=bookingCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
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

    public String getVariant() {
        return variant;
    }

    public void setVariant(String variant) {
        this.variant = variant;
    }

    public int getManufactureYear() {
        return manufactureYear;
    }

    public void setManufactureYear(int manufactureYear) {
        this.manufactureYear = manufactureYear;
    }

    public Long getKms() {
        return kms;
    }

    public void setKms(Long kms) {
        this.kms = kms;
    }

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public int getNumberOfOwners() {
        return numberOfOwners;
    }

    public void setNumberOfOwners(int numberOfOwners) {
        this.numberOfOwners = numberOfOwners;
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

    public String getVehicleLocation() {
        return vehicleLocation;
    }

    public void setVehicleLocation(String vehicleLocation) {
        this.vehicleLocation = vehicleLocation;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public Long getExpectedPrice() {
        return expectedPrice;
    }

    public void setExpectedPrice(Long expectedPrice) {
        this.expectedPrice = expectedPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public boolean isBiddingAllowed() {
        return biddingAllowed;
    }

    public void setBiddingAllowed(boolean biddingAllowed) {
        this.biddingAllowed = biddingAllowed;
    }


}
