package com.foodhub.dto;

import com.foodhub.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;

public record PaymentStatusUpdateRequest(
        @NotNull(message = "Payment status is required")
        PaymentStatus status) {
}
