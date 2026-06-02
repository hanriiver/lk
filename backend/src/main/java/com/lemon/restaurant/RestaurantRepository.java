package com.lemon.restaurant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface RestaurantRepository extends JpaRepository<Restaurant, UUID> {

    @Query("""
        SELECT r FROM Restaurant r
        WHERE (:category IS NULL OR r.category = :category)
          AND (:q IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :q, '%'))
                          OR LOWER(r.location) LIKE LOWER(CONCAT('%', :q, '%'))
                          OR LOWER(r.review) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY r.createdAt DESC
    """)
    List<Restaurant> search(@Param("category") String category, @Param("q") String q);
}
