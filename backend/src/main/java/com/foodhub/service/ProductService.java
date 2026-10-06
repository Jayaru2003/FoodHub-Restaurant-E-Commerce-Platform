package com.foodhub.service;

import com.foodhub.entity.Category;
import com.foodhub.entity.Product;
import com.foodhub.dto.ProductRequest;
import com.foodhub.dto.ProductResponse;
import com.foodhub.exception.CategoryNotFoundException;
import com.foodhub.exception.ProductNotFoundException;
import com.foodhub.repository.CategoryRepository;
import com.foodhub.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findProducts(String name, Long categoryId, Boolean available) {
        String normalizedName = name == null || name.isBlank() ? null : name.trim();
        return productRepository.search(normalizedName, categoryId, available)
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findProduct(Long id) {
        return ProductResponse.from(findProductEntity(id));
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        apply(request, product);
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductEntity(id);
        apply(request, product);
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProductEntity(id);
        productRepository.delete(product);
    }

    private Product findProductEntity(Long id) {
        return productRepository.findByIdWithCategory(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    private void apply(ProductRequest request, Product product) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.getCategoryId()));
        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setStockQuantity(request.getStockQuantity());
        product.setAvailable(request.getAvailable());
        product.setCategory(category);
    }
}
