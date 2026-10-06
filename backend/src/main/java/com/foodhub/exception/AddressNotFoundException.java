package com.foodhub.exception;

public class AddressNotFoundException extends RuntimeException {
    public AddressNotFoundException(Long id) {
        super("Address with id " + id + " was not found for the authenticated user");
    }
}
