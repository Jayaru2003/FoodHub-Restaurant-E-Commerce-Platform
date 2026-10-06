package com.foodhub.service;

import com.foodhub.entity.Category;
import com.foodhub.entity.Product;
import com.foodhub.dto.ProductRequest;
import com.foodhub.dto.ProductPageResponse;
import com.foodhub.dto.ProductResponse;
import com.foodhub.exception.CategoryNotFoundException;
import com.foodhub.exception.ProductNotFoundException;
import com.foodhub.repository.CategoryRepository;
import com.foodhub.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Set;

@Service
public class ProductService {
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("price", "name");

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public ProductPageResponse findProducts(
            int page,
            int size,
            String search,
            Long categoryId,
            Boolean available,
            String sortBy,
            String direction) {
        if (categoryId != null && !categoryRepository.existsById(categoryId)) {
            throw new CategoryNotFoundException(categoryId);
        }

        String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
        String requestedSortField = sortBy == null ? "" : sortBy.trim().toLowerCase(Locale.ROOT);
        String sortField = ALLOWED_SORT_FIELDS.contains(requestedSortField) ? requestedSortField : "name";
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortField).and(Sort.by(sortDirection, "id")));

        Page<Product> products = productRepository.search(normalizedSearch, categoryId, available, pageable);
        return new ProductPageResponse(
                products.map(ProductResponse::from).getContent(),
                products.getNumber(),
                products.getSize(),
                products.getTotalElements(),
                products.getTotalPages(),
                products.isFirst(),
                products.isLast());
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
