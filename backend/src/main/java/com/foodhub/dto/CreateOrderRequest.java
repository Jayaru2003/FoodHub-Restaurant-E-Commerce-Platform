package com.foodhub.dto;

import com.foodhub.entity.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateOrderRequest(
        @NotBlank(message = "Customer name is required")
        @Size(max = 100, message = "Customer name must not exceed 100 characters")
        String customerName,
        @NotBlank(message = "Customer phone is required")
        @Size(max = 30, message = "Customer phone must not exceed 30 characters")
        String customerPhone,
        @NotNull(message = "Address is required")
        Long addressId,
        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod,
        @Size(max = 1000, message = "Notes must not exceed 1000 characters")
        String notes,
        @NotEmpty(message = "At least one order item is required")
        List<@Valid OrderItemRequest> items) {
}
