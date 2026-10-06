package com.foodhub.dto;

import com.foodhub.entity.Order;
import com.foodhub.entity.OrderItem;
import com.foodhub.entity.PaymentMethod;
import com.foodhub.entity.PaymentStatus;
import com.foodhub.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        String customerName,
        String customerPhone,
        String notes,
        AddressResponse address,
        List<OrderItemResponse> items,
        BigDecimal deliveryFee,
        BigDecimal totalAmount,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        OrderStatus orderStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getNotes(),
                AddressResponse.from(order.getAddress()),
                order.getItems().stream().map(OrderItemResponse::from).toList(),
                order.getDeliveryFee(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getOrderStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt());
    }
}
