package com.foodhub.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.foodhub.dto.CategoryRequest;
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
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "admin@foodhub.com", roles = {"ADMIN"})
    void testCreateCategory_Success_asAdmin() throws Exception {
        CategoryRequest request = new CategoryRequest();
        request.setName("Desserts");
        request.setDescription("Sweet treats and cakes");

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Desserts"))
                .andExpect(jsonPath("$.description").value("Sweet treats and cakes"));
    }

    @Test
    @WithMockUser(username = "admin@foodhub.com", roles = {"ADMIN"})
    void testDeleteCategory_Success_asAdmin() throws Exception {
        Category category = new Category();
        category.setName("Beverages");
        category.setDescription("Soft drinks & juices");
        Category saved = categoryRepository.save(category);

        mockMvc.perform(delete("/api/categories/" + saved.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/categories/" + saved.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin@foodhub.com", roles = {"ADMIN"})
    void testDeleteCategory_HasProducts_ReturnsConflict() throws Exception {
        Category category = new Category();
        category.setName("Main Course");
        category.setDescription("Substantial main dishes");
        Category savedCategory = categoryRepository.save(category);

        Product product = new Product();
        product.setName("Steak Dinner");
        product.setPrice(new BigDecimal("24.99"));
        product.setStockQuantity(10);
        product.setAvailable(true);
        product.setCategory(savedCategory);
        productRepository.save(product);

        mockMvc.perform(delete("/api/categories/" + savedCategory.getId()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error", containsString("cannot be deleted while it has products")));
    }

    @Test
    @WithMockUser(username = "customer@foodhub.com", roles = {"CUSTOMER"})
    void testDeleteCategory_Forbidden_asCustomer() throws Exception {
        Category category = new Category();
        category.setName("Appetizers");
        Category savedCategory = categoryRepository.save(category);

        mockMvc.perform(delete("/api/categories/" + savedCategory.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@foodhub.com", roles = {"ADMIN"})
    void testDeleteCategory_NotFound() throws Exception {
        mockMvc.perform(delete("/api/categories/99999"))
                .andExpect(status().isNotFound());
    }
}
