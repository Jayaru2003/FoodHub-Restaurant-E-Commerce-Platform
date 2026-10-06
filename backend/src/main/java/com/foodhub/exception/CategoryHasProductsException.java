package com.foodhub.exception;

public class CategoryHasProductsException extends RuntimeException {
    public CategoryHasProductsException(Long id) {
        super("Category with id " + id + " cannot be deleted while it has products");
    }
}
