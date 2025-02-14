package com.example.CarDetails.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.CarDetails.dto.BookingDTO;
import com.example.CarDetails.dto.CarDetailDto;
import com.example.CarDetails.dto.ResponseDto;
import com.example.CarDetails.dto.UserDto;
import com.example.CarDetails.exception.CarNotFoundException;
import com.example.CarDetails.model.CarDetail;
import com.example.CarDetails.repository.CarDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CarDetailService {

    private Cloudinary cloudinary;

    @Autowired
    private RestTemplate restTemplate;
    private final String bookingServiceBaseUrl = "http://localhost:8085/bookings";

    public CarDetailService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }
    @Autowired
    private CarDetailRepository carDetailRepository;



public CarDetail addCarDetail(CarDetail carDetail, List<MultipartFile> images) {
    try {
        // Check if the car already exists based on registrationNumber or VIN
        boolean exists = carDetailRepository.existsByRegistrationNumber(carDetail.getRegistrationNumber());


        if (exists) {
            throw new IllegalArgumentException("A car with this registration number already exists.");
        }

        // Upload images to Cloudinary and collect URLs
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                // Upload image to Cloudinary and get URL
                Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
                String url = uploadResult.get("secure_url").toString();
                imageUrls.add(url);
            }
        }

        // Set images URLs and status
        carDetail.setImageUrls(imageUrls);
//        carDetail.setUserId(userId);
        carDetail.setStatus("PENDING"); // Default to PENDING status

        // Save car detail to the repository
        CarDetail savedCar = carDetailRepository.save(carDetail);

        // Optionally notify admin service (if implemented)
        // String adminServiceUrl = "http://ADMIN-SERVICE/admin/notify";
        // restTemplate.postForObject(adminServiceUrl, savedCar, Void.class);

        return savedCar;

    } catch (IOException e) {
        throw new RuntimeException("Error uploading images to Cloudinary: " + e.getMessage(), e);
    }
}


    public CarDetail getCarDetailById(Long carId) {
        return carDetailRepository.findById(carId)
                .orElseThrow(() -> new CarNotFoundException("Car not found with id: " + carId));
    }

    public void deleteCarDetail(Long carId) {
        CarDetail existingCar = carDetailRepository.findById(carId)
                .orElseThrow(() -> new CarNotFoundException("Car not found with id: " + carId));
        carDetailRepository.delete(existingCar);
    }
    public CarDetail updateCarDetail(Long carId, CarDetail updatedCarDetail, List<MultipartFile> images) {
        CarDetail existingCar = carDetailRepository.findById(carId)
                .orElseThrow(() -> new CarNotFoundException("Car not found with id: " + carId));
    
        // Allow updates to all fields except immutable ones
        existingCar.setCarMake(updatedCarDetail.getCarMake());
        existingCar.setCarModel(updatedCarDetail.getCarModel());
        existingCar.setVariant(updatedCarDetail.getVariant());
        existingCar.setManufactureYear(updatedCarDetail.getManufactureYear());
        existingCar.setKms(updatedCarDetail.getKms());
        existingCar.setBodyType(updatedCarDetail.getBodyType());
        existingCar.setNumberOfOwners(updatedCarDetail.getNumberOfOwners());
        existingCar.setFuelType(updatedCarDetail.getFuelType());
        existingCar.setTransmissionType(updatedCarDetail.getTransmissionType());
        existingCar.setVehicleLocation(updatedCarDetail.getVehicleLocation());
        existingCar.setExpectedPrice(updatedCarDetail.getExpectedPrice());
        existingCar.setDescription(updatedCarDetail.getDescription());
        existingCar.setBiddingAllowed(updatedCarDetail.isBiddingAllowed());
    
        // Handle image updates (replace old images with new ones)
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile image : images) {
                try {
                    Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
                    String url = uploadResult.get("secure_url").toString();
                    imageUrls.add(url);
                } catch (IOException e) {
                    throw new RuntimeException("Error uploading images to Cloudinary: " + e.getMessage(), e);
                }
            }
            existingCar.setImageUrls(imageUrls);
        }
    
        
        return carDetailRepository.save(existingCar);
    }
    
    public List<CarDetail> getCarsByStatus(String status) {
        return carDetailRepository.findByStatus(status);
    }
    public List<ResponseDto> getCarDetailsByUserId(Long userId) {
        // Fetch all cars for the given userId
        List<CarDetail> cars = carDetailRepository.findByUserId(userId);

        // Stream through the car list and map each car to a ResponseDto
        List<ResponseDto> responseDtos = cars.stream()
                .map(car -> {
                    // Fetch user data from the User Service using RestTemplate
                    String userServiceUrl = "http://localhost:8081/users/" + car.getUserId();
                    UserDto userDto = restTemplate.getForObject(userServiceUrl, UserDto.class);

                    // Map CarDetail to CarDetailDto
                    CarDetailDto carDetailDto = mapToCarDetailDto(car);

                    // Combine CarDetailDto and UserDto into a ResponseDto
                    return new ResponseDto(Collections.singletonList(carDetailDto), userDto);
                })
                .collect(Collectors.toList());

        return responseDtos;
    }


    private CarDetailDto mapToCarDetailDto(CarDetail car) {
        CarDetailDto carDetailDto = new CarDetailDto();
        carDetailDto.setId(car.getId());
        carDetailDto.setRegistrationNumber(car.getRegistrationNumber());
        carDetailDto.setOwnerName(car.getOwnerName());
        carDetailDto.setCarMake(car.getCarMake());
        carDetailDto.setCarModel(car.getCarModel());
        carDetailDto.setVariant(car.getVariant());
        carDetailDto.setManufactureYear(car.getManufactureYear());
        carDetailDto.setKms(car.getKms());
        carDetailDto.setBodyType(car.getBodyType());
        carDetailDto.setNumberOfOwners(car.getNumberOfOwners());
        carDetailDto.setFuelType(car.getFuelType());
        carDetailDto.setTransmissionType(car.getTransmissionType());
        carDetailDto.setVin(car.getVin());
        carDetailDto.setVehicleLocation(car.getVehicleLocation());
        carDetailDto.setExpectedPrice(car.getExpectedPrice());
        carDetailDto.setDescription(car.getDescription());
        carDetailDto.setImageUrls(car.getImageUrls());
        carDetailDto.setStatus(car.getStatus());
        carDetailDto.setUserId(car.getUserId());
        carDetailDto.setSold(car.isSold());
        carDetailDto.setBookingCount(car.getBookingCount());
        carDetailDto.setBiddingAllowed(car.isBiddingAllowed());

        return carDetailDto;
    }
    public void updateCarStatus(Long carId, String status) {
        CarDetail carDetail = carDetailRepository.findById(carId)
                .orElseThrow(() -> new CarNotFoundException("Car not found with ID: " + carId));
        carDetail.setStatus(status);
        carDetailRepository.save(carDetail);
    }

    public List<CarDetail> getallcars() {
        List<CarDetail> carDetails = carDetailRepository.findAll();
        return carDetails;
    }
    public List<BookingDTO> getBookingsBySeller(Long sellerId) {
        String bookingServiceUrl = "http://localhost:8085/bookings/seller/" + sellerId;
        List<BookingDTO> bookings = restTemplate.getForObject(bookingServiceUrl, List.class);

        if (bookings == null) {
            return new ArrayList<>(); // Return empty list if no bookings found
        }

        return bookings;
    }

    public String acceptOrRejectBooking(Long sellerId, Long bookingId, String status) {
        // Construct the URL for the Booking Service's update endpoint
        String url = bookingServiceBaseUrl + "/update/" + bookingId + "?status=" + status;

        try {
            // Call the Booking Service using RestTemplate
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, null, String.class);

            // Check if the booking status was updated successfully
            if (response.getStatusCode() == HttpStatus.OK) {
                return "Booking status updated to " + status;
            } else {
                throw new Exception("Failed to update booking status.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while processing the request.", e);
        }
    }
    public String updateSoldStatus(Long carId, boolean isSold) {
        Optional<CarDetail> carDetailOpt = carDetailRepository.findById(carId);
        if (carDetailOpt.isPresent()) {
            CarDetail carDetail = carDetailOpt.get();
            carDetail.setSold(isSold); // Set the `isSold` value
            carDetailRepository.save(carDetail); // Save changes
            return "Car sold status updated to " + isSold;
        } else {
            throw new RuntimeException("Car with ID " + carId + " not found");
        }
    }

    public long countAllCars() {
        return carDetailRepository.count();
    }

    public long countPendingCars() {
        return carDetailRepository.countByStatus("PENDING");
    }

    public long countSoldCars() {
        return carDetailRepository.countByIsSold(true);
    }

    public List<CarDetailDto> getTopSellingCarsBasedOnBookings() {
        // Step 1: Get all cars
        List<CarDetail> allCars = carDetailRepository.findAll();

        // Step 2: Fetch number of bookings for each car and add to the list
        for (CarDetail car : allCars) {
            long bookingCount = getBookingCountForCar(car.getId());
            car.setBookingCount(bookingCount); 
        }

        // Step 3: Sort the cars based on booking count in descending order
        allCars.sort((car1, car2) -> Long.compare(car2.getBookingCount(), car1.getBookingCount()));

        // Step 4: Convert to CarDetailDto and return
        return allCars.stream()
                .map(car -> {

                    CarDetailDto carDetailDto = mapToCarDetailDto(car);
                    return carDetailDto;
                })
                .collect(Collectors.toList());
    }

    // Get the booking count for a specific car
    private long getBookingCountForCar(Long carId) {
        // Assuming Booking Service has an endpoint like "/bookings/count?carId={carId}"
        return restTemplate.getForObject(bookingServiceBaseUrl  + "/count?carId=" + carId, Long.class);
    }

    public long countBiddingEnabledCars() {
        return carDetailRepository.countByBiddingAllowed(true);
    }

    public boolean incrementBookingCount(Long carId) {
        Optional<CarDetail> carDetailOpt = carDetailRepository.findById(carId);
        if (carDetailOpt.isPresent()) {
            CarDetail carDetail = carDetailOpt.get();
            carDetail.setBookingCount(carDetail.getBookingCount() + 1); // Increment booking count
            carDetailRepository.save(carDetail); // Save the updated car
            return true;
        }
        return false;
    }

    public List<String> getAllUniqueModels() {
        List<CarDetail> cars = carDetailRepository.findAll();
        return cars.stream()
            .map(CarDetail::getCarModel)
            .distinct()
            .collect(Collectors.toList());
    }

    public List<Integer> getAllUniqueYears() {
        List<CarDetail> cars = carDetailRepository.findAll();
        return cars.stream()
            .map(CarDetail::getManufactureYear)
            .distinct()
            .sorted(Comparator.reverseOrder())
            .collect(Collectors.toList());
    }

    public List<String> getAllUniqueMakes() {
        List<CarDetail> cars = carDetailRepository.findAll();
        return cars.stream()
            .map(CarDetail::getCarMake)
            .distinct()
            .collect(Collectors.toList());
    }

}
