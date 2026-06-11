package com.ailearning.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "course_chapter")
public class CourseChapter {
    @Id
    @Column(nullable = false, length = 50)
    private String id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 30)
    private String duration;

    @Column(nullable = false)
    private boolean done;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
