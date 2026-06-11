package com.ailearning.backend.repository;

import com.ailearning.backend.entity.WrongQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WrongQuestionRepository extends JpaRepository<WrongQuestion, Long> {
    List<WrongQuestion> findByUserIdOrderByUpdatedAtDesc(Long userId);
}
