package com.ailearning.backend.repository;

import com.ailearning.backend.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByUserIdOrderByCreatedAtDesc(Long userId);
}
