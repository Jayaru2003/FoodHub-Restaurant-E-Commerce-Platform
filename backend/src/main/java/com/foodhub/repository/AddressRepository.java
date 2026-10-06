package com.foodhub.repository;

import com.foodhub.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByIdAndUserId(Long id, Long userId);
    List<Address> findByUserIdOrderByCreatedAtDesc(Long userId);
}
