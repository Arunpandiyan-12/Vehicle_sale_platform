package com.example.BookingService.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MicroserviceConfig {

    @Value("${microservice.user-service.url}")
    private String userServiceUrl;

    @Value("${microservice.car-detail-service.url}")
    private String carDetailServiceUrl;

    public String getUserServiceUrl() {
        return userServiceUrl;
    }

    public String getCarDetailServiceUrl() {
        return carDetailServiceUrl;
    }
}