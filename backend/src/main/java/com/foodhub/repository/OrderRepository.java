package com.foodhub.repository;

import com.foodhub.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
            select distinct o from Order o
            join fetch o.user
            join fetch o.address
            left join fetch o.items i
            left join fetch i.product p
            left join fetch p.category
            where o.user.id = :userId
            order by o.createdAt desc
            """)
    List<Order> findAllByUserIdWithDetails(@Param("userId") Long userId);

    @Query("""
            select distinct o from Order o
            join fetch o.user
            join fetch o.address
            left join fetch o.items i
            left join fetch i.product p
            left join fetch p.category
            where o.id = :id and o.user.id = :userId
            """)
    Optional<Order> findByIdAndUserIdWithDetails(@Param("id") Long id, @Param("userId") Long userId);

    @Query("""
            select distinct o from Order o
            join fetch o.user
            join fetch o.address
            left join fetch o.items i
            left join fetch i.product p
            left join fetch p.category
            where o.id = :id
            """)
    Optional<Order> findByIdWithDetails(@Param("id") Long id);

    @Query("""
            select distinct o from Order o
            join fetch o.user
            join fetch o.address
            left join fetch o.items i
            left join fetch i.product p
            left join fetch p.category
            order by o.createdAt desc
            """)
    List<Order> findAllWithDetails();
}
