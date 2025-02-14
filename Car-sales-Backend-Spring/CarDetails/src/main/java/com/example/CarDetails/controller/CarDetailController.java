package com.example.CarDetails.controller;
import com.example.CarDetails.dto.AnalyticsDto;
import com.example.CarDetails.dto.BookingDTO;
import com.example.CarDetails.dto.CarDetailDto;
import com.example.CarDetails.dto.ResponseDto;
import com.example.CarDetails.model.CarDetail;
import com.example.CarDetails.service.CarDetailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/cars")
public class CarDetailController{

    @Autowired
    private CarDetailService carDetailService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarDetail> addCarDetail( @RequestPart("data") String carData,@RequestPart("images") List<MultipartFile> files) throws IOException {
                                                   
        ObjectMapper objectMapper = new ObjectMapper();
        
        CarDetail carDetail = objectMapper.readValue(carData, CarDetail.class);
        CarDetail addedCar = carDetailService.addCarDetail(carDetail, files);
        return ResponseEntity.ok(addedCar);
    }
    

    @GetMapping
    public ResponseEntity<List<CarDetail>> gettallcars(){
        List<CarDetail> carDetails = carDetailService.getallcars();
        return ResponseEntity.ok(carDetails);
    }

    @PutMapping("/{carId}/update")
    public ResponseEntity<CarDetail> updateCarDetail(
        @PathVariable Long carId,
        @ModelAttribute CarDetail updatedCarDetail,
        @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) {
        CarDetail updatedCar = carDetailService.updateCarDetail(carId, updatedCarDetail, images);
        return ResponseEntity.ok(updatedCar);
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<Void> deleteCarDetail(@PathVariable Long carId) {
        carDetailService.deleteCarDetail(carId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{carId}")
    public ResponseEntity<CarDetail> getCarDetailById(@PathVariable Long carId) {
        CarDetail carDetail = carDetailService.getCarDetailById(carId);
        return ResponseEntity.ok(carDetail);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CarDetail>> getCarsByStatus(@PathVariable String status) {
        List<CarDetail> cars = carDetailService.getCarsByStatus(status);
        return ResponseEntity.ok(cars);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResponseDto>> getCarDetailsByUserId(@PathVariable Long userId) {
        List<ResponseDto> carDetails = carDetailService.getCarDetailsByUserId(userId);
        return ResponseEntity.ok(carDetails);
    }

    @PutMapping("/{carId}/approve")
    public ResponseEntity<Void> approveCar(@PathVariable Long carId) {
        carDetailService.updateCarStatus(carId, "APPROVED");
        return ResponseEntity.ok().build();
    }

    // Reject a car by setting status to "REJECTED"
    @PutMapping("/{carId}/reject")
    public ResponseEntity<Void> rejectCar(@PathVariable Long carId) {
        carDetailService.updateCarStatus(carId, "REJECTED");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{sellerId}/bookings")
    public ResponseEntity<List<BookingDTO>> getBookingsBySeller(@PathVariable Long sellerId) {
        try {
            List<BookingDTO> bookings = carDetailService.getBookingsBySeller(sellerId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PutMapping("/{sellerId}/bookings/{bookingId}/status")
    public ResponseEntity<String> acceptOrRejectBooking(
            @PathVariable Long sellerId,
            @PathVariable Long bookingId,
            @RequestParam String status) {

        try {
            // Call the service layer to update the booking status
            String response = carDetailService.acceptOrRejectBooking(sellerId, bookingId, status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while processing the request.");
        }
    }
    @PutMapping("/{carId}/update-sold-status")
public ResponseEntity<String> updateSoldStatus(
        @PathVariable Long carId,
        @RequestBody Map<String, Boolean> request) { // Directly accept a Map
    try {
        boolean isSold = request.get("isSold"); // Extract 'isSold' from request
        String response = carDetailService.updateSoldStatus(carId, isSold);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating sold status: " + e.getMessage());
    }
}


    @GetMapping("/analytics")
    public AnalyticsDto getAnalytics() {
        AnalyticsDto analytics = new AnalyticsDto();
        analytics.setTotalCars(carDetailService.countAllCars());
        analytics.setPendingCars(carDetailService.countPendingCars());
        analytics.setSoldCars(carDetailService.countSoldCars());
        analytics.setTopSellingCar(carDetailService.getTopSellingCarsBasedOnBookings());
        analytics.setBiddingEnabledCount(carDetailService.countBiddingEnabledCars());
        return analytics;
    }
    @GetMapping("/trending-cars")
    public ResponseEntity<List<CarDetailDto>> getTopSellingCarsBasedOnBookings() {
       List<CarDetailDto> topCarselList= carDetailService.getTopSellingCarsBasedOnBookings();
       return  ResponseEntity.ok(topCarselList);
    }
    

    @PostMapping("/{carId}/increment-booking-count")
    public ResponseEntity<String> incrementBookingCount(@PathVariable Long carId) {
        boolean updated = carDetailService.incrementBookingCount(carId);
        if (updated) {
            return ResponseEntity.ok("Booking count incremented successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Car not found!");
        }
    }

    @GetMapping("/models")
    public ResponseEntity<List<String>> getAvailableModels() {
        List<String> models = carDetailService.getAllUniqueModels();
        return ResponseEntity.ok(models);
    }

    @GetMapping("/years")
    public ResponseEntity<List<Integer>> getAvailableYears() {
        List<Integer> years = carDetailService.getAllUniqueYears();
        return ResponseEntity.ok(years);
    }

    @GetMapping("/makes")
    public ResponseEntity<List<String>> getAvailableMakes() {
        List<String> makes = carDetailService.getAllUniqueMakes();
        return ResponseEntity.ok(makes);
    }

}