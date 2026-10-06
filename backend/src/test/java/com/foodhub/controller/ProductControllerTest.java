package com.foodhub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodhub.dto.ProductRequest;
import com.foodhub.entity.Category;
import com.foodhub.entity.Product;
import com.foodhub.repository.CategoryRepository;
import com.foodhub.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();

        Category category = new Category();
        category.setName("Burgers");
        category.setDescription("Delicious juicy burgers");
        testCategory = categoryRepository.save(category);
    }

    @Test
    @WithMockUser(username = "admin@foodhub.com", roles = {"ADMIN"})
    void testCreateProduct_Success_asAdmin() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setName("Classic Cheeseburger");
        request.setDescription("Juicy beef patty with cheddar cheese");
        request.setPrice(new BigDecimal("12.99"));
        request.setImageUrl("/images/cheeseburger.jpg");
        request.setStockQuantity(25);
        request.setAvailable(true);
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Classic Cheeseburger"))
                .andExpect(jsonPath("$.price").value(12.99))
                .andExpect(jsonPath("$.stockQuantity").value(25))
                .andExpect(jsonPath("$.category.id").value(testCategory.getId()));
    }

    @Test
    @WithMockUser(username = "customer@foodhub.com", roles = {"CUSTOMER"})
    void testCreateProduct_Forbidden_asCustomer() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setName("Forbidden Burger");
        request.setPrice(new BigDecimal("10.00"));
        request.setStockQuantity(10);
        request.setAvailable(true);
        request.setCategoryId(testCategory.getId());

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@foodhub.com", roles = {"ADMIN"})
    void testCreateProduct_ValidationFailures() throws Exception {
        // Test Empty Name
        ProductRequest emptyNameRequest = new ProductRequest();
        emptyNameRequest.setName("   ");
        emptyNameRequest.setPrice(new BigDecimal("10.00"));
        emptyNameRequest.setStockQuantity(10);
        emptyNameRequest.setAvailable(true);
        emptyNameRequest.setCategoryId(testCategory.getId());

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emptyNameRequest)))
                .andExpect(status().isBadRequest());

        // Test Negative Price
        ProductRequest negativePriceRequest = new ProductRequest();
        negativePriceRequest.setName("Negative Price Burger");
        negativePriceRequest.setPrice(new BigDecimal("-5.00"));
        negativePriceRequest.setStockQuantity(10);
        negativePriceRequest.setAvailable(true);
        negativePriceRequest.setCategoryId(testCategory.getId());

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(negativePriceRequest)))
                .andExpect(status().isBadRequest());

        // Test Negative Stock
        ProductRequest negativeStockRequest = new ProductRequest();
        negativeStockRequest.setName("Negative Stock Burger");
        negativeStockRequest.setPrice(new BigDecimal("5.00"));
        negativeStockRequest.setStockQuantity(-1);
        negativeStockRequest.setAvailable(true);
        negativeStockRequest.setCategoryId(testCategory.getId());

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(negativeStockRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "admin@foodhub.com", roles = {"ADMIN"})
    void testUpdateProduct_Success_asAdmin() throws Exception {
        Product product = new Product();
        product.setName("Old Burger Name");
        product.setPrice(new BigDecimal("9.99"));
        product.setStockQuantity(10);
        product.setAvailable(true);
        product.setCategory(testCategory);
        Product saved = productRepository.save(product);

        ProductRequest updateRequest = new ProductRequest();
        updateRequest.setName("Updated Deluxe Burger");
        updateRequest.setDescription("Newly updated delicious description");
        updateRequest.setPrice(new BigDecimal("14.50"));
        updateRequest.setStockQuantity(30);
        updateRequest.setAvailable(false);
        updateRequest.setCategoryId(testCategory.getId());

        mockMvc.perform(put("/api/products/" + saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Deluxe Burger"))
                .andExpect(jsonPath("$.price").value(14.50))
                .andExpect(jsonPath("$.stockQuantity").value(30))
                .andExpect(jsonPath("$.available").value(false));
    }

    @Test
    @WithMockUser(username = "admin@foodhub.com", roles = {"ADMIN"})
    void testDeleteProduct_Success_asAdmin() throws Exception {
        Product product = new Product();
        product.setName("ToDelete Burger");
        product.setPrice(new BigDecimal("8.00"));
        product.setStockQuantity(5);
        product.setAvailable(true);
        product.setCategory(testCategory);
        Product saved = productRepository.save(product);

        mockMvc.perform(delete("/api/products/" + saved.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/products/" + saved.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "customer@foodhub.com", roles = {"CUSTOMER"})
    void testDeleteProduct_Forbidden_asCustomer() throws Exception {
        Product product = new Product();
        product.setName("Protected Burger");
        product.setPrice(new BigDecimal("8.00"));
        product.setStockQuantity(5);
        product.setAvailable(true);
        product.setCategory(testCategory);
        Product saved = productRepository.save(product);

        mockMvc.perform(delete("/api/products/" + saved.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    void testGetProducts_SearchAndFilter() throws Exception {
        Product p1 = new Product();
        p1.setName("Bacon Double Cheeseburger");
        p1.setPrice(new BigDecimal("15.99"));
        p1.setStockQuantity(20);
        p1.setAvailable(true);
        p1.setCategory(testCategory);
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setName("Veggie Delight Burger");
        p2.setPrice(new BigDecimal("11.99"));
        p2.setStockQuantity(15);
        p2.setAvailable(true);
        p2.setCategory(testCategory);
        productRepository.save(p2);

        // Search test
        mockMvc.perform(get("/api/products")
                .param("search", "Bacon"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name").value("Bacon Double Cheeseburger"));

        // Filter by category test
        mockMvc.perform(get("/api/products")
                .param("categoryId", testCategory.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)));
    }
}
