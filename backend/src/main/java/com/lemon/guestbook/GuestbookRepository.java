package com.lemon.guestbook;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface GuestbookRepository extends JpaRepository<Guestbook, UUID> {
    List<Guestbook> findAllByOrderByCreatedAtDesc();
}
