package com.lemon.menu;

import com.lemon.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ApiResponse<List<Menu>> getMenus(
            @RequestParam(required = false) String base,
            @RequestParam(required = false) String q) {
        return ApiResponse.ok(menuService.getMenus(base, q));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Menu>> createMenu(
            @Valid @RequestPart("data") MenuRequest req,
            @RequestPart(value = "photo", required = false) MultipartFile photo) throws IOException {
        return ResponseEntity.status(201).body(ApiResponse.ok(menuService.createMenu(req, photo)));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ApiResponse<Menu> updateMenu(
            @PathVariable UUID id,
            @RequestPart("data") MenuRequest req,
            @RequestPart(value = "photo", required = false) MultipartFile photo) throws IOException {
        return ApiResponse.ok(menuService.updateMenu(id, req, photo));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteMenu(@PathVariable UUID id) {
        menuService.deleteMenu(id);
        return ApiResponse.ok();
    }
}
