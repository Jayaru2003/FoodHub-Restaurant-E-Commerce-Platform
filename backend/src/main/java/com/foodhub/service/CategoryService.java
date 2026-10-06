package com.foodhub.service;

import com.foodhub.dto.CategoryRequest;
import com.foodhub.dto.CategoryResponse;
import com.foodhub.entity.Category;
import com.foodhub.exception.CategoryHasProductsException;
import com.foodhub.exception.CategoryNameAlreadyExistsException;
import com.foodhub.exception.CategoryNotFoundException;
import com.foodhub.repository.CategoryRepository;
import com.foodhub.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findCategories() {
        return categoryRepository.findAll().stream()
                .map(cat -> CategoryResponse.from(cat, productRepository.countByCategoryId(cat.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse findCategory(Long id) {
        Category cat = findCategoryEntity(id);
        return CategoryResponse.from(cat, productRepository.countByCategoryId(cat.getId()));
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String name = normalizeName(request.getName());
        ensureNameAvailable(name, null);

        Category category = new Category();
        apply(request, category, name);
        Category saved = categoryRepository.save(category);
        return CategoryResponse.from(saved, 0L);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = findCategoryEntity(id);
        String name = normalizeName(request.getName());
        ensureNameAvailable(name, id);

        apply(request, category, name);
        Category saved = categoryRepository.save(category);
        return CategoryResponse.from(saved, productRepository.countByCategoryId(saved.getId()));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = findCategoryEntity(id);
        if (productRepository.existsByCategoryId(id)) {
            throw new CategoryHasProductsException(id);
        }
        categoryRepository.delete(category);
    }

    private Category findCategoryEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }

    private void ensureNameAvailable(String name, Long id) {
        boolean exists = id == null
                ? categoryRepository.existsByNameIgnoreCase(name)
                : categoryRepository.existsByNameIgnoreCaseAndIdNot(name, id);
        if (exists) {
            throw new CategoryNameAlreadyExistsException(name);
        }
    }

    private void apply(CategoryRequest request, Category category, String name) {
        category.setName(name);
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
    }

    private String normalizeName(String name) {
        return name.trim();
    }
}
