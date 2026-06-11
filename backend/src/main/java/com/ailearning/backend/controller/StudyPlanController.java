package com.ailearning.backend.controller;

import com.ailearning.backend.common.ApiResponse;
import com.ailearning.backend.common.AuthContext;
import com.ailearning.backend.dto.StudyPlanRequest;
import com.ailearning.backend.service.StudyPlanService;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/study-plan")
public class StudyPlanController {
    private final StudyPlanService studyPlanService;

    public StudyPlanController(StudyPlanService studyPlanService) {
        this.studyPlanService = studyPlanService;
    }

    @GetMapping("/list")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(studyPlanService.list(AuthContext.getCurrentUserId(), page, pageSize, priority, status, keyword));
    }

    @PostMapping
    public ApiResponse<Map<String, Object>> create(@Valid @RequestBody StudyPlanRequest request) {
        return ApiResponse.success("创建成功", studyPlanService.create(AuthContext.getCurrentUserId(), request));
    }

    @PutMapping("/{id}")
    public ApiResponse<Map<String, Object>> update(@PathVariable Long id, @RequestBody StudyPlanRequest request) {
        return ApiResponse.success("更新成功", studyPlanService.update(AuthContext.getCurrentUserId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        studyPlanService.delete(AuthContext.getCurrentUserId(), id);
        return ApiResponse.success("删除成功", null);
    }
}
