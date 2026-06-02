package com.lemon.menu;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MenuRepository extends JpaRepository<Menu, UUID> {

    @Query(value = """
        SELECT * FROM menus m
        WHERE (:base IS NULL OR m.base = :base)
          AND (:q IS NULL OR m.name ILIKE CONCAT('%', :q, '%')
                          OR m.description ILIKE CONCAT('%', :q, '%'))
        ORDER BY m.created_at DESC
    """, nativeQuery = true)
    List<Menu> search(@Param("base") String base, @Param("q") String q);
}
