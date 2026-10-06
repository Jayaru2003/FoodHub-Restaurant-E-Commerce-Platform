package com.foodhub.repository;

import com.foodhub.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
            select p from Product p
            join fetch p.category c
            where (:name is null or lower(p.name) like lower(concat('%', :name, '%')))
              and (:categoryId is null or c.id = :categoryId)
              and (:available is null or p.available = :available)
            order by p.name asc
            """)
    List<Product> search(@Param("name") String name,
                         @Param("categoryId") Long categoryId,
                         @Param("available") Boolean available);

    @Query("select p from Product p join fetch p.category where p.id = :id")
    Optional<Product> findByIdWithCategory(@Param("id") Long id);
}
