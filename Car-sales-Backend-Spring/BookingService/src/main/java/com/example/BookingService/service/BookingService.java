package com.example.BookingService.service;

import com.example.BookingService.dto.BookingDTO;
import com.example.BookingService.dto.CarDetailDTO;
import com.example.BookingService.dto.CarWithBookingsDTO;
import com.example.BookingService.dto.UserDTO;
import com.example.BookingService.entity.Booking;
import com.example.BookingService.exception.BookingNotFoundException;
import com.example.BookingService.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RestTemplate restTemplate;

    // Create a booking request with optional bid
    public String createBooking(BookingDTO bookingDTO) {
        // Fetch the car details from CarDetailService to check if bidding is enabled
        String carDetailServiceUrl = "http://localhost:8084/carslist/" + bookingDTO.getCarId();
        CarDetailDTO carDetail = restTemplate.getForObject(carDetailServiceUrl, CarDetailDTO.class);

        if (carDetail == null) {
            return "Car not found!";
        }

        if (carDetail.isBiddingAllowed() && bookingDTO.getBidAmount() == null) {
            return "Bidding is enabled for this car. Please provide a bid amount.";
        }

        Long sellerId = carDetail.getUserId();

        // Fetch the buyer details from UserService using buyerId
        String userServiceUrl = "http://localhost:8081/users/" + bookingDTO.getBuyerId();
        UserDTO buyer = restTemplate.getForObject(userServiceUrl, UserDTO.class);

        if (buyer == null) {
            return "Buyer not found!";
        }

        // Check if the buyer has already booked this car
        Optional<Booking> existingBooking = bookingRepository.findByBuyerIdAndCarId(bookingDTO.getBuyerId(), bookingDTO.getCarId());

        if (existingBooking.isPresent()) {
            return "You have already booked this car.";
        }

        // Create booking and save to the database
        Booking booking = new Booking();
        booking.setBuyerId(bookingDTO.getBuyerId());
        booking.setCarId(bookingDTO.getCarId());
        booking.setSellerId(sellerId);
        booking.setStatus("Pending");  // Initial status is pending
        if (carDetail.isBiddingAllowed()) {
            booking.setBidAmount(bookingDTO.getBidAmount());
        } else {
            booking.setBidAmount(null);
        }

        bookingRepository.save(booking);
        String incrementUrl = "http://localhost:8082/cars/" + bookingDTO.getCarId() + "/increment-booking-count";
        restTemplate.postForObject(incrementUrl, null, String.class);

        return "Booking request created successfully!";
    }

    // Get bookings by sellerId
    public List<BookingDTO> getBookingsBySeller(Long sellerId) {
        List<Booking> bookings = bookingRepository.findBySellerId(sellerId);
        return mapToDTO(bookings);
    }

    // Get bookings by buyerId
    public List<BookingDTO> getBookingsByBuyer(Long buyerId) {
        List<Booking> bookings = bookingRepository.findByBuyerId(buyerId);
        return mapToDTO(bookings);
    }

    // Update booking status (Accept/Reject)
    public String updateBookingStatus(Long bookingId, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            bookingRepository.save(booking);
            return "Booking status updated to " + status;
        }
        return "Booking not found!";
    }
    private List<BookingDTO> mapToDTO(List<Booking> bookings) {
        return bookings.stream()
                .map(booking -> {
                    // Fetch the buyer details from UserService
                    UserDTO buyer = restTemplate.getForObject("http://localhost:8081/users/" + booking.getBuyerId(), UserDTO.class);
                    return new BookingDTO(
                            booking.getId(),
                            booking.getBuyerId(),
                            booking.getCarId(),
                            booking.getSellerId(),
                            booking.getStatus(),
                            booking.getBidAmount(),
                            buyer != null ? buyer.getName() : null,  // Set buyer name if available
                            buyer != null ? buyer.getEmail() : null ,
                            booking.getSellerMessage()
                    );
                })
                .collect(Collectors.toList());
    }

    public CarWithBookingsDTO getCarDetailsWithBookings(Long carId) {
        try {
            // Fetch car details from CarDetailService

            String carDetailServiceUrl = "http://localhost:8084/carslist/" + carId;
            CarDetailDTO carDetail = restTemplate.getForObject(carDetailServiceUrl, CarDetailDTO.class);
            if (carDetail == null) {
                throw new BookingNotFoundException("Car with ID " + carId + " not found!");
            }

            // Fetch bookings related to this car from the database
            List<Booking> bookings = bookingRepository.findByCarId(carId);

            // Map bookings to BookingDTOs
            List<BookingDTO> bookingDTOs = mapToDTO(bookings);


            // Create and return CarWithBookingsDTO
            return new CarWithBookingsDTO(carDetail, bookingDTOs);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching car details with bookings: " + e.getMessage());
        }
    }

    public long countAllBookings() {
        return bookingRepository.count();
    }

    public long countActiveBookings() {
        return bookingRepository.countByStatus("Pending");
    }
    public long getBookingCountForCar(Long carId) {
        // Fetch the count of bookings for the given carId
        return bookingRepository.countByCarId(carId);
    }


}
