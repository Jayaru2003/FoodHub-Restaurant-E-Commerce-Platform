package com.foodhub.exception;

public class CategoryNameAlreadyExistsException extends RuntimeException {
    public CategoryNameAlreadyExistsException(String name) {
        super("A category with name '" + name + "' already exists");
    }
}
