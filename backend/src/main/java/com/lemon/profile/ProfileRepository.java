package com.lemon.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    List<Profile> findByGenderOrderByCreatedAtDesc(String gender);
    List<Profile> findAllByOrderByCreatedAtDesc();
}
