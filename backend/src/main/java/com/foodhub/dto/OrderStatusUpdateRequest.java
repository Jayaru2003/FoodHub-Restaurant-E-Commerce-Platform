package com.foodhub.dto;

import com.foodhub.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(
        @NotNull(message = "Order status is required")
        OrderStatus status) {
}
