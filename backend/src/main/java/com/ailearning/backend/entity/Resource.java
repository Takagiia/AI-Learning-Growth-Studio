package com.ailearning.backend.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "resources")
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 50)
    private String type;

    @Column(length = 50)
    private String category;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private int downloadCount;
}
