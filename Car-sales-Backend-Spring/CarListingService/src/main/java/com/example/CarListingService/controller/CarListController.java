package com.example.CarListingService.controller;


import com.example.CarListingService.dto.CarDetailDto;
import com.example.CarListingService.dto.CarFilterDto;
import com.example.CarListingService.service.CarListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carslist")
public class CarListController {

    @Autowired
    private CarListingService carListingService;

    @GetMapping
    public ResponseEntity<List<CarDetailDto>> getAllApprovedCars() {
        try {
            List<CarDetailDto> cars = carListingService.getAllAvailableApprovedCars();
            return ResponseEntity.ok(cars);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{carId}")
    public CarDetailDto getCarById(@PathVariable Long carId) {
        return carListingService.getCarById(carId);
    }

    @PostMapping("/estimate-price/{carId}")
    public ResponseEntity<String> estimatePrice(@PathVariable Long carId) {
        // Get car details using the carId
        CarDetailDto carDetailsDto = carListingService.getCarById(carId);

        if (carDetailsDto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Car not found");
        }

        // Estimate the car price using the details
        String estimatedPrice = carListingService.estimateCarPrice(carDetailsDto);

        return ResponseEntity.ok("Estimated Price: " + estimatedPrice);
    }
    
    @PostMapping("/estimate-price")
public ResponseEntity<String> estimatePrice(@RequestBody CarDetailDto carDetailsDto) {
    if (carDetailsDto == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid request data");
    }

    // Estimate the price
    String estimatedPrice = carListingService.estimateCarPrice(carDetailsDto);
    return ResponseEntity.ok("Estimated Price: " + estimatedPrice);
}

    
    @GetMapping("/filter")
    public ResponseEntity<List<CarDetailDto>> filterCars(CarFilterDto filterDto) {
        List<CarDetailDto> allCars = carListingService.getAllAvailableApprovedCars();

        if (allCars.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<CarDetailDto> filteredCars = carListingService.filterCars(allCars, filterDto);

        if (filteredCars.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(filteredCars);
    }



}
