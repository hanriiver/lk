package com.lemon.common.config;

import com.lemon.auth.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 인증 없이 접근 가능
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/verify-pin").permitAll()
                .requestMatchers(HttpMethod.GET,  "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/v1/menus/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/v1/profiles/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/v1/restaurants/**").permitAll()
                .requestMatchers(HttpMethod.GET,  "/api/v1/guestbook/**").permitAll()
                // 방명록·프로필·맛집 작성은 누구나
                .requestMatchers(HttpMethod.POST, "/api/v1/guestbook").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/profiles").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/restaurants").permitAll()
                // 나머지(관리자)는 JWT 필요
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
