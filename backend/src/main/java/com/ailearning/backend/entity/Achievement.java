package com.ailearning.backend.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 255)
    private String description;

    @Column(length = 100)
    private String icon;

    @Column(nullable = false)
    private boolean unlocked;

    private LocalDateTime unlockedAt;

    @Column(nullable = false)
    private int progress;

    @Column(nullable = false)
    private int target;

    @Column(length = 50)
    private String category;

    @Column(length = 50)
    private String rarity;

    @Column(nullable = false)
    private int points;
}
