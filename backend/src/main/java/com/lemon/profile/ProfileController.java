package com.lemon.profile;

import com.lemon.common.exception.ResourceNotFoundException;
import com.lemon.common.response.ApiResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileRepository profileRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    @GetMapping
    public ApiResponse<?> getProfiles(@RequestParam(required = false) String gender) {
        if (gender != null && !gender.isBlank()) {
            return ApiResponse.ok(profileRepository.findByGenderOrderByCreatedAtDesc(gender));
        }
        List<Profile> all = profileRepository.findAllByOrderByCreatedAtDesc();
        return ApiResponse.ok(Map.of(
                "males",   all.stream().filter(p -> "남성".equals(p.getGender())).toList(),
                "females", all.stream().filter(p -> "여성".equals(p.getGender())).toList()
        ));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<Profile>> create(
            @RequestPart("data") ProfileRequest req,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) throws IOException, InterruptedException {
        String photoUrl = photo != null && !photo.isEmpty() ? uploadPhoto(photo) : null;
        Profile profile = Profile.builder()
                .gender(req.getGender())
                .birthYear(req.getBirthYear())
                .job(req.getJob())
                .height(req.getHeight())
                .weight(req.getWeight())
                .ageMin(req.getAgeMin())
                .ageMax(req.getAgeMax())
                .ideal(req.getIdeal())
                .detail(req.getDetail())
                .photoUrl(photoUrl)
                .instagramId(req.getInstagramId())
                .build();
        return ResponseEntity.status(201).body(ApiResponse.ok(profileRepository.save(profile)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        if (!profileRepository.existsById(id)) {
            throw new ResourceNotFoundException("프로필을 찾을 수 없습니다.");
        }
        profileRepository.deleteById(id);
        return ApiResponse.ok();
    }

    private String uploadPhoto(MultipartFile file) throws IOException, InterruptedException {
        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf('.')))
                .orElse("");
        String fileName = UUID.randomUUID() + ext;
        String uploadUrl = supabaseUrl + "/storage/v1/object/profiles/" + fileName;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadUrl))
                .header("Authorization", "Bearer " + serviceRoleKey)
                .header("Content-Type", file.getContentType())
                .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();

        HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        return supabaseUrl + "/storage/v1/object/public/profiles/" + fileName;
    }

    @Data
    public static class ProfileRequest {
        @NotBlank(message = "성별을 선택하세요")
        private String gender;

        @NotNull(message = "출생연도를 입력하세요")
        private Integer birthYear;

        private String job;
        private Integer height;
        private Integer weight;
        private Integer ageMin;
        private Integer ageMax;
        private String ideal;
        private String detail;
        private String instagramId;
    }
}
