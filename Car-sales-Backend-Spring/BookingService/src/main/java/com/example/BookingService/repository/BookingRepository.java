package com.example.BookingService.repository;

import com.example.BookingService.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByBuyerId(Long buyerId); // Find all bookings for a buyer
    List<Booking> findBySellerId(Long sellerId); // Find all bookings for a seller
    List<Booking> findByCarId(Long carId); // Find all bookings for a car
    List<Booking> findByCarIdAndBuyerIdAndStatus(Long carId, Long buyerId, String status);

    Optional<Booking> findByBuyerIdAndCarId(Long buyerId, Long carId);

    long countByStatus(String active);

    long countByCarId(Long carId);
}