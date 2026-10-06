package com.foodhub.dto;

import com.foodhub.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        Integer stockQuantity,
        boolean available,
        CategorySummary category,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getStockQuantity(),
                product.isAvailable(),
                new CategorySummary(product.getCategory().getId(), product.getCategory().getName()),
                product.getCreatedAt(),
                product.getUpdatedAt());
    }
}
