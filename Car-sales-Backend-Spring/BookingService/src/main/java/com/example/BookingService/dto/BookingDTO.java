package com.example.BookingService.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BookingDTO {
    private Long id;
    private Long buyerId;
    private Long carId;
    private Long sellerId;
    private String status; // Pending, Accepted, Rejected
    private Double bidAmount; // Include bid amount
    @JsonProperty("username")
    private String name;
    private String email;
    private String sellerMessage = "I'm interested to buy";

    public BookingDTO() {
    }

    public BookingDTO(Long id, Long buyerId, Long carId, Long sellerId, String status, Double bidAmount, String name, String email,String sellerMessage) {
        this.id = id;
        this.buyerId = buyerId;
        this.carId = carId;
        this.sellerId = sellerId;
        this.status = status;
        this.bidAmount = bidAmount;
        this.name = name;
        this.email = email;
        this.sellerMessage=sellerMessage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(Double bidAmount) {
        this.bidAmount = bidAmount;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSellerMessage() {
        return sellerMessage;
    }

    public void setSellerMessage(String sellerMessage) {
        this.sellerMessage = sellerMessage;
    }
}


