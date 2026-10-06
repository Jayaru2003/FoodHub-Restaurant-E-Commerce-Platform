package com.foodhub.dto;

import com.foodhub.entity.Category;

import java.time.LocalDateTime;

public record CategoryResponse(
        Long id,
        String name,
        String description,
        String imageUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getImageUrl(),
                category.getCreatedAt(),
                category.getUpdatedAt());
    }
}
