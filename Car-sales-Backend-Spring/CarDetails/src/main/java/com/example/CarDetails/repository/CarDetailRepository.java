package com.example.CarDetails.repository;


import com.example.CarDetails.model.CarDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarDetailRepository extends JpaRepository<CarDetail, Long> {
    List<CarDetail> findByStatus(String status);
    List<CarDetail> findByUserId(Long userId);

    long countByIsSold(boolean b);

    long countByStatus(String pending);

    long countByBiddingAllowed(boolean b);

    boolean existsByRegistrationNumber(String registrationNumber);
}
