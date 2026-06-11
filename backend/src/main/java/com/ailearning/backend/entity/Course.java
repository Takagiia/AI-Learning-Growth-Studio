package com.ailearning.backend.entity;

import javax.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "course")
public class Course {
    @Id
    @Column(nullable = false, length = 40)
    private String id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 40)
    private String category;

    @Column(length = 255)
    private String cover;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private int progress;

    @Column(nullable = false, length = 50)
    private String teacher;

    @Column(nullable = false)
    private int lessons;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "course_knowledge_point", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "knowledge_point", nullable = false, length = 100)
    @OrderColumn(name = "sort_order")
    private List<String> knowledgePoints = new ArrayList<>();

    @OneToMany(mappedBy = "course", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderColumn(name = "sort_order")
    private List<CourseChapter> chapters = new ArrayList<>();
}
