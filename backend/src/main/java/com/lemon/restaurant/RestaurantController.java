package com.lemon.restaurant;

import com.lemon.common.exception.ResourceNotFoundException;
import com.lemon.common.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;

    @GetMapping
    public ApiResponse<List<RestaurantDto>> getRestaurants(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q) {
        String catParam = (category == null || category.isBlank()) ? null : category;
        String qParam   = (q == null || q.isBlank()) ? null : q;
        List<Restaurant> results = restaurantRepository.search(catParam, qParam);
        return ApiResponse.ok(results.stream().map(RestaurantDto::from).toList());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RestaurantDto>> create(@Valid @RequestBody RestaurantRequest req) {
        Restaurant r = Restaurant.builder()
                .name(req.getName())
                .category(req.getCategory())
                .location(req.getLocation())
                .recommender(req.getRecommender())
                .review(req.getReview())
                .recMenus(req.getRecMenus() != null ? String.join(",", req.getRecMenus()) : null)
                .build();
        return ResponseEntity.status(201).body(ApiResponse.ok(RestaurantDto.from(restaurantRepository.save(r))));
    }

    @PutMapping("/{id}")
    public ApiResponse<RestaurantDto> update(@PathVariable UUID id, @RequestBody RestaurantRequest req) {
        Restaurant r = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("맛집을 찾을 수 없습니다."));
        if (req.getName() != null)        r.setName(req.getName());
        if (req.getCategory() != null)    r.setCategory(req.getCategory());
        if (req.getLocation() != null)    r.setLocation(req.getLocation());
        if (req.getRecommender() != null) r.setRecommender(req.getRecommender());
        if (req.getReview() != null)      r.setReview(req.getReview());
        if (req.getRecMenus() != null)    r.setRecMenus(String.join(",", req.getRecMenus()));
        return ApiResponse.ok(RestaurantDto.from(restaurantRepository.save(r)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        if (!restaurantRepository.existsById(id)) {
            throw new ResourceNotFoundException("맛집을 찾을 수 없습니다.");
        }
        restaurantRepository.deleteById(id);
        return ApiResponse.ok();
    }

    @Data
    public static class RestaurantRequest {
        @NotBlank(message = "가게 이름을 입력하세요")
        private String name;

        @NotBlank(message = "카테고리를 선택하세요")
        private String category;

        private String location;
        private String recommender;
        private String review;
        private List<String> recMenus;
    }

    public record RestaurantDto(
            UUID id, String name, String category, String location,
            String recommender, String review, List<String> recMenus,
            java.time.Instant createdAt) {

        static RestaurantDto from(Restaurant r) {
            List<String> menus = (r.getRecMenus() != null && !r.getRecMenus().isBlank())
                    ? Arrays.stream(r.getRecMenus().split(","))
                            .map(String::trim).filter(s -> !s.isEmpty()).toList()
                    : List.of();
            return new RestaurantDto(r.getId(), r.getName(), r.getCategory(), r.getLocation(),
                    r.getRecommender(), r.getReview(), menus, r.getCreatedAt());
        }
    }
}
