package com.foodhub.dto;

import com.foodhub.entity.Category;

import java.time.LocalDateTime;

public record CategoryResponse(
        Long id,
        String name,
        String description,
        String imageUrl,
        Long productCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static CategoryResponse from(Category category) {
        long count = category.getProducts() != null ? category.getProducts().size() : 0L;
        return from(category, count);
    }

    public static CategoryResponse from(Category category, long productCount) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getImageUrl(),
                productCount,
                category.getCreatedAt(),
                category.getUpdatedAt());
    }
}
