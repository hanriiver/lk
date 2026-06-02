package com.lemon.restaurant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface RestaurantRepository extends JpaRepository<Restaurant, UUID> {

    @Query(value = """
        SELECT * FROM restaurants r
        WHERE (:category IS NULL OR r.category = :category)
          AND (:q IS NULL OR r.name ILIKE CONCAT('%', :q, '%')
                          OR r.location ILIKE CONCAT('%', :q, '%')
                          OR r.review ILIKE CONCAT('%', :q, '%'))
        ORDER BY r.created_at DESC
    """, nativeQuery = true)
    List<Restaurant> search(@Param("category") String category, @Param("q") String q);
}
