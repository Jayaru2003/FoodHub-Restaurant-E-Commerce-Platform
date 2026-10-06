package com.foodhub.repository;

import com.foodhub.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import jakarta.persistence.LockModeType;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByCategoryId(Long categoryId);

    @Query(value = """
            select p from Product p
            join fetch p.category c
            where (:search is null or lower(p.name) like lower(concat('%', :search, '%')))
              and (:categoryId is null or c.id = :categoryId)
              and (:available is null or p.available = :available)
            """,
            countQuery = """
                    select count(p) from Product p
                    where (:search is null or lower(p.name) like lower(concat('%', :search, '%')))
                      and (:categoryId is null or p.category.id = :categoryId)
                      and (:available is null or p.available = :available)
                    """)
    Page<Product> search(@Param("search") String search,
                         @Param("categoryId") Long categoryId,
                         @Param("available") Boolean available,
                         Pageable pageable);

    @Query("select p from Product p join fetch p.category where p.id = :id")
    Optional<Product> findByIdWithCategory(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p join fetch p.category where p.id = :id")
    Optional<Product> findByIdForOrder(@Param("id") Long id);
}
