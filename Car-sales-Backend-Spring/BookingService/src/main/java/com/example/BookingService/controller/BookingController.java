package com.example.BookingService.controller;

import com.example.BookingService.dto.BookingAnalyticsDto;
import com.example.BookingService.dto.BookingDTO;
import com.example.BookingService.dto.CarWithBookingsDTO;
import com.example.BookingService.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public String createBooking(@RequestBody BookingDTO bookingDTO) {
        return bookingService.createBooking(bookingDTO);
    }

    @GetMapping("/seller/{sellerId}")
    public List<BookingDTO> getBookingsBySeller(@PathVariable Long sellerId) {
        return bookingService.getBookingsBySeller(sellerId);
    }

    @GetMapping("/buyer/{buyerId}")
    public List<BookingDTO> getBookingsByBuyer(@PathVariable Long buyerId) {
        return bookingService.getBookingsByBuyer(buyerId);
    }

    @PutMapping("/update/{bookingId}")
    public String updateBookingStatus(@PathVariable Long bookingId, @RequestParam String status) {
        return bookingService.updateBookingStatus(bookingId, status);
    }

    @GetMapping("/{carId}/details-with-bookings")
    public ResponseEntity<CarWithBookingsDTO> getCarDetailsWithBookings(@PathVariable Long carId) {
        try {
            CarWithBookingsDTO carWithBookings = bookingService.getCarDetailsWithBookings(carId);
            return ResponseEntity.ok(carWithBookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/analytics")
    public BookingAnalyticsDto getAnalytics() {
        BookingAnalyticsDto analytics = new BookingAnalyticsDto();
        analytics.setTotalBookings(bookingService.countAllBookings());
        analytics.setActiveBookings(bookingService.countActiveBookings());
        return analytics;
    }
    @GetMapping("/count")
    public long getBookingCountForCar(@RequestParam("carId") Long carId) {
        return bookingService.getBookingCountForCar(carId); // Fetch booking count from database
    }
}
