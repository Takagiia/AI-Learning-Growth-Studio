package com.ailearning.backend.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class StudyPlanRequest {
    @NotBlank(message = "标题不能为空")
    private String title;

    private String content;
    private LocalDate deadline;
    private String priority;
    private String status;
}
