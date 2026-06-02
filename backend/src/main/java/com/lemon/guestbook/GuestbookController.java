package com.lemon.guestbook;

import com.lemon.common.exception.ResourceNotFoundException;
import com.lemon.common.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/guestbook")
@RequiredArgsConstructor
public class GuestbookController {

    private final GuestbookRepository guestbookRepository;

    @GetMapping
    public ApiResponse<List<Guestbook>> getAll() {
        return ApiResponse.ok(guestbookRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Guestbook>> create(@Valid @RequestBody WriteRequest req) {
        Guestbook entry = Guestbook.builder()
                .nickname(req.getNickname())
                .content(req.getContent())
                .build();
        return ResponseEntity.status(201).body(ApiResponse.ok(guestbookRepository.save(entry)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        if (!guestbookRepository.existsById(id)) {
            throw new ResourceNotFoundException("방명록을 찾을 수 없습니다.");
        }
        guestbookRepository.deleteById(id);
        return ApiResponse.ok();
    }

    @Data
    public static class WriteRequest {
        @NotBlank(message = "닉네임을 입력하세요")
        @Size(max = 20)
        private String nickname;

        @NotBlank(message = "내용을 입력하세요")
        @Size(max = 300)
        private String content;
    }
}
