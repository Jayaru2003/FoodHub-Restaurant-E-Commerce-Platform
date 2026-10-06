package com.foodhub.dto;

import com.foodhub.entity.Address;

public record AddressResponse(
        Long id,
        String addressLine,
        String city,
        String postalCode) {

    public static AddressResponse from(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getAddressLine(),
                address.getCity(),
                address.getPostalCode());
    }
}
