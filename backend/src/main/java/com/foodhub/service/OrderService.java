package com.foodhub.service;

import com.foodhub.dto.CreateOrderRequest;
import com.foodhub.dto.OrderResponse;
import com.foodhub.dto.OrderStatusUpdateRequest;
import com.foodhub.dto.PaymentStatusUpdateRequest;
import com.foodhub.entity.Address;
import com.foodhub.entity.Order;
import com.foodhub.entity.OrderItem;
import com.foodhub.entity.OrderStatus;
import com.foodhub.entity.PaymentStatus;
import com.foodhub.entity.Product;
import com.foodhub.entity.User;
import com.foodhub.exception.AddressNotFoundException;
import com.foodhub.exception.InvalidOrderException;
import com.foodhub.exception.OrderNotFoundException;
import com.foodhub.exception.ProductNotFoundException;
import com.foodhub.repository.AddressRepository;
import com.foodhub.repository.OrderRepository;
import com.foodhub.repository.ProductRepository;
import com.foodhub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {
    private static final BigDecimal DELIVERY_FEE = BigDecimal.ZERO;

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String email) {
        User user = findUser(email);
        Address address = addressRepository.findByIdAndUserId(request.addressId(), user.getId())
                .orElseThrow(() -> new AddressNotFoundException(request.addressId()));

        Map<Long, Integer> quantities = new LinkedHashMap<>();
        for (var requestedItem : request.items()) {
            if (quantities.put(requestedItem.productId(), requestedItem.quantity()) != null) {
                throw new InvalidOrderException("Product " + requestedItem.productId() + " appears more than once");
            }
        }

        Map<Long, Product> products = new LinkedHashMap<>();
        quantities.keySet().stream().sorted(Comparator.naturalOrder()).forEach(productId -> {
            Product product = productRepository.findByIdForOrder(productId)
                    .orElseThrow(() -> new ProductNotFoundException(productId));
            if (!product.isAvailable()) {
                throw new InvalidOrderException("Product '" + product.getName() + "' is not available");
            }
            int quantity = quantities.get(productId);
            if (product.getStockQuantity() == null || product.getStockQuantity() < quantity) {
                throw new InvalidOrderException("Insufficient stock for product '" + product.getName() + "'");
            }
            products.put(productId, product);
        });

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setCustomerName(request.customerName().trim());
        order.setCustomerPhone(request.customerPhone().trim());
        order.setNotes(request.notes());
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setDeliveryFee(DELIVERY_FEE);

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();
        for (var requestedItem : request.items()) {
            Product product = products.get(requestedItem.productId());
            int quantity = requestedItem.quantity();
            BigDecimal itemSubtotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setUnitPrice(product.getPrice());
            item.setSubtotal(itemSubtotal);
            items.add(item);

            product.setStockQuantity(product.getStockQuantity() - quantity);
            subtotal = subtotal.add(itemSubtotal);
        }
        order.getItems().addAll(items);
        order.setTotalAmount(subtotal.add(DELIVERY_FEE));

        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findCustomerOrders(String email) {
        User user = findUser(email);
        return orderRepository.findAllByUserIdWithDetails(user.getId()).stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findCustomerOrder(Long id, String email) {
        User user = findUser(email);
        return orderRepository.findByIdAndUserIdWithDetails(id, user.getId())
                .map(OrderResponse::from)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAllOrders() {
        return orderRepository.findAllWithDetails().stream()
                .map(OrderResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findAdminOrder(Long id) {
        return orderRepository.findByIdWithDetails(id)
                .map(OrderResponse::from)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        Order order = findOrder(id);
        order.setOrderStatus(request.status());
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse updatePaymentStatus(Long id, PaymentStatusUpdateRequest request) {
        Order order = findOrder(id);
        order.setPaymentStatus(request.status());
        return OrderResponse.from(order);
    }

    private Order findOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidOrderException("Authenticated user was not found"));
    }
}
