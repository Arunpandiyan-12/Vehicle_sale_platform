package com.example.CarListingService.service;

import com.example.CarListingService.dto.CarDetailDto;
import com.example.CarListingService.dto.CarFilterDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarListingService {
    private final ChatModel chatModel;

    public CarListingService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @Autowired
    private RestTemplate restTemplate;

    private static final String CAR_DETAIL_SERVICE_URL = "http://localhost:8082/cars";

    public List<CarDetailDto> getAllAvailableApprovedCars() {
        // Correct URL to fetch all approved cars from the CarDetailController
        String url = CAR_DETAIL_SERVICE_URL + "/status/APPROVED";

        // Fetch the list of approved cars
        ResponseEntity<List<CarDetailDto>> response = restTemplate.exchange(
                url, HttpMethod.GET, null, new ParameterizedTypeReference<List<CarDetailDto>>() {}
        );

        // Filter the cars to include only those where soldStatus is false
        List<CarDetailDto> approvedCars = response.getBody();

        if (approvedCars == null || approvedCars.isEmpty()) {
            return Collections.emptyList();
        }

//        return approvedCars.stream()
//                .filter(car -> !car.isSoldStatus()) // Include only cars where soldStatus is false
//                .collect(Collectors.toList());
        return approvedCars.stream()
                .filter(car -> !car.isSold()) // Include only cars where soldStatus is false
                .peek(car -> System.out.println("Car soldStatus: " + car.isSold())) // Log soldStatus for debugging
                .collect(Collectors.toList());

    }



    // Fetch car details by ID
    public CarDetailDto getCarById(Long carId) {
        try {
            String url = CAR_DETAIL_SERVICE_URL + "/" + carId;
            return restTemplate.getForObject(url, CarDetailDto.class);
        } catch (Exception e) {
            // Log the error here
            System.out.println("Error fetching car details: " + e.getMessage());
            return null; // You might want to throw a custom exception here
        }
    }


    // Estimate the price of a car
    public String estimateCarPrice(CarDetailDto carDetailsDto) {
        try {
            // Construct the prompt based on car details
            String prompt = buildPrompt(carDetailsDto);
            System.out.println("Sending prompt to ChatGPT: " + prompt);

            // Call the AI service (ChatModel) to estimate the price
            String response = chatModel.call(prompt);
            System.out.println("ChatGPT Response: " + response);

            return response;
        } catch (Exception e) {
            // Log the error
            System.out.println("Error estimating car price: " + e.getMessage());
            return "Error estimating price"; // Handle this appropriately
        }
    }

    // Build the prompt for ChatGPT
    private String buildPrompt(CarDetailDto carDetailsDto) {
        return String.format(
                "Estimate the price of a car with the following details in one line: " +
                        "Model: %s, Year: %d, Location: %s.", carDetailsDto.getCarMake(),
                carDetailsDto.getCarModel(), carDetailsDto.getManufactureYear(), carDetailsDto.getVehicleLocation()
        );
    }


    public List<CarDetailDto> filterCars(List<CarDetailDto> allCars, CarFilterDto filterDto) {
        return allCars.stream()
                .filter(car -> filterDto.getCarMake() == null || car.getCarMake().equalsIgnoreCase(filterDto.getCarMake()))
                .filter(car -> filterDto.getCarModel() == null || car.getCarModel().equalsIgnoreCase(filterDto.getCarModel()))
                .filter(car -> filterDto.getFuelType() == null || car.getFuelType().equalsIgnoreCase(filterDto.getFuelType()))
                .filter(car -> filterDto.getTransmissionType() == null || car.getTransmissionType().equalsIgnoreCase(filterDto.getTransmissionType()))
                .filter(car -> filterDto.getManufactureYearStart() == null || car.getManufactureYear() >= filterDto.getManufactureYearStart())
                .filter(car -> filterDto.getKmsMin() == null || car.getKms() >= filterDto.getKmsMin())
                .filter(car -> filterDto.getKmsMax() == null || car.getKms() <= filterDto.getKmsMax())
                .filter(car -> filterDto.getPriceMin() == null || car.getExpectedPrice() >= filterDto.getPriceMin())
                .filter(car -> filterDto.getPriceMax() == null || car.getExpectedPrice() <= filterDto.getPriceMax())
                .collect(Collectors.toList());
    }


//    public List<CarDetailDto> filterCars(CarFilterCriteria filterCriteria) {
//        // Implement filtering logic based on the filter criteria
//        return null; // Placeholder
//    }
}
