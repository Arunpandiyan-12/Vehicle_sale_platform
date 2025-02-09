package com.example.BookingService.dto;

import java.util.List;

public class CarWithBookingsDTO {
    private CarDetailDTO carDetail;
    private List<BookingDTO> bookings;

    public CarWithBookingsDTO() {
    }

    public CarWithBookingsDTO(CarDetailDTO carDetail, List<BookingDTO> bookings) {
        this.carDetail = carDetail;
        this.bookings = bookings;
    }

    public CarDetailDTO getCarDetail() {
        return carDetail;
    }

    public void setCarDetail(CarDetailDTO carDetail) {
        this.carDetail = carDetail;
    }

    public List<BookingDTO> getBookings() {
        return bookings;
    }

    public void setBookings(List<BookingDTO> bookings) {
        this.bookings = bookings;
    }
// Getters and Setters
}
