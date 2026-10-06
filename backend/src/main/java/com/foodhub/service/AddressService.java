package com.foodhub.service;

import com.foodhub.dto.AddressResponse;
import com.foodhub.dto.CreateAddressRequest;
import com.foodhub.entity.Address;
import com.foodhub.entity.User;
import com.foodhub.exception.InvalidOrderException;
import com.foodhub.repository.AddressRepository;
import com.foodhub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> getUserAddresses(String email) {
        User user = findUser(email);
        return addressRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(AddressResponse::from)
                .toList();
    }

    @Transactional
    public AddressResponse createAddress(CreateAddressRequest request, String email) {
        User user = findUser(email);

        Address address = new Address();
        address.setUser(user);
        address.setAddressLine(request.addressLine().trim());
        address.setCity(request.city().trim());
        address.setPostalCode(request.postalCode().trim());

        return AddressResponse.from(addressRepository.save(address));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidOrderException("Authenticated user was not found"));
    }
}
