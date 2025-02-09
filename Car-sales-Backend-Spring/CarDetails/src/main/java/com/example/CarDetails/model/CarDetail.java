package com.example.CarDetails.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class CarDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

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

    @ElementCollection
    private List<String> imageUrls; // URLs of images uploaded to Cloudinary

    @Column(nullable = false)
    private String status = "PENDING";
    // Status can be "PENDING", "ACCEPTED", "REJECTED"
    @JsonProperty("userId")
    private Long userId;

    @Column(nullable = false)
    private boolean biddingAllowed = false;

    @Column(nullable = false)
    private boolean isSold = false; // Tracks whether the car has been sold
    @Column(nullable = false)
    private long bookingCount=0;

    public long getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(long bookingCount) {
        this.bookingCount = bookingCount;
    }



    public CarDetail(Long id, String registrationNumber, String ownerName, String carMake, String carModel, String variant, int manufactureYear, Long kms, String bodyType, int numberOfOwners, String fuelType, String transmissionType, String vin, Long expectedPrice, String description, List<String> imageUrls, String status, Long userId, String vehicleLocation, boolean isSold, long bookingCount) {
        this.Id = id;
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
        this.vin = vin;
        this.expectedPrice = expectedPrice;
        this.description = description;
        this.imageUrls = imageUrls;
        this.status = status;
        this.userId = userId;
        this.vehicleLocation = vehicleLocation;
        this.isSold = isSold;
        this.bookingCount = bookingCount;
    }

    public CarDetail() {}

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        this.Id = id;
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

    public boolean isSold() {
        return isSold;
    }
    @JsonProperty("isSold")
    public void setSold(boolean isSold) {
        this.isSold = isSold;
    }

    public String getVehicleLocation() {
        return vehicleLocation;
    }

    public void setVehicleLocation(String vehicleLocation) {
        this.vehicleLocation = vehicleLocation;
    }
}
