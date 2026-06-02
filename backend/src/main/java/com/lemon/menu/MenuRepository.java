package com.lemon.menu;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MenuRepository extends JpaRepository<Menu, UUID> {

    @Query("""
        SELECT m FROM Menu m
        WHERE (:base IS NULL OR m.base = :base)
          AND (:q IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :q, '%'))
                          OR LOWER(m.description) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY m.createdAt DESC
    """)
    List<Menu> search(@Param("base") String base, @Param("q") String q);
}
