package com.lemon.auth;

import com.lemon.common.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtProvider jwtProvider;

    @Value("${admin.pin}")
    private String adminPin;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    @PostMapping("/verify-pin")
    public ResponseEntity<ApiResponse<?>> verifyPin(@Valid @RequestBody PinRequest req) {
        if (!adminPin.equals(req.getPin())) {
            return ResponseEntity.status(401).body(ApiResponse.fail("PIN이 올바르지 않습니다."));
        }
        String token = jwtProvider.generateAdminToken();
        String expiresAt = Instant.now().plus(expirationMs, ChronoUnit.MILLIS).toString();
        return ResponseEntity.ok(ApiResponse.ok(new TokenResponse(token, expiresAt)));
    }

    @Data
    public static class PinRequest {
        @NotBlank(message = "PIN을 입력하세요")
        private String pin;
    }

    public record TokenResponse(String token, String expiresAt) {}
}
