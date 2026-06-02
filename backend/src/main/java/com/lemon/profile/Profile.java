package com.lemon.profile;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 5)
    private String gender;

    @Column(name = "birth_year", nullable = false)
    private Integer birthYear;

    @Column(length = 50)
    private String job;

    private Integer height;
    private Integer weight;

    @Column(name = "age_min")
    private Integer ageMin;

    @Column(name = "age_max")
    private Integer ageMax;

    @Column(columnDefinition = "TEXT")
    private String ideal;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "instagram_id", length = 100)
    private String instagramId;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
