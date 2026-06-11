package com.ailearning.backend.controller;

import com.ailearning.backend.common.ApiResponse;
import com.ailearning.backend.common.AuthContext;
import com.ailearning.backend.service.WrongQuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static java.util.Map.entry;

@RestController
@RequestMapping("/api/wrongQuestion")
public class WrongQuestionController {
    private final WrongQuestionService wrongQuestionService;

    public WrongQuestionController(WrongQuestionService wrongQuestionService) {
        this.wrongQuestionService = wrongQuestionService;
    }

    @GetMapping("/list")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize
    ) {
        return ApiResponse.success(wrongQuestionService.list(AuthContext.getCurrentUserId(), category, keyword, difficulty, status, page, pageSize));
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<Map<String, Object>> detail(@PathVariable Long id) {
        var q = wrongQuestionService.detail(AuthContext.getCurrentUserId(), id);
        Map<String, Object> m = Map.ofEntries(
                entry("id", q.getId()),
                entry("title", q.getTitle()),
                entry("content", q.getContent()),
                entry("answer", q.getAnswer()),
                entry("analysis", q.getAnalysis()),
                entry("category", q.getCategory()),
                entry("difficulty", q.getDifficulty()),
                entry("wrongCount", q.getWrongCount()),
                entry("tags", q.getTags()),
                entry("mastered", q.isMastered()),
                entry("createTime", q.getCreatedAt().toString())
        );
        return ApiResponse.success(m);
    }

    @PostMapping("/create")
    public ApiResponse<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        var q = wrongQuestionService.create(AuthContext.getCurrentUserId(), body);
        return ApiResponse.success("添加成功", Map.of("id", q.getId()));
    }

    @PutMapping("/update/{id}")
    public ApiResponse<Map<String, Object>> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        var q = wrongQuestionService.update(AuthContext.getCurrentUserId(), id, body);
        return ApiResponse.success("更新成功", Map.of("id", q.getId()));
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        wrongQuestionService.delete(AuthContext.getCurrentUserId(), id);
        return ApiResponse.success("删除成功", null);
    }

    @PostMapping("/master/{id}")
    public ApiResponse<Void> markAsMastered(@PathVariable Long id) {
        wrongQuestionService.markAsMastered(AuthContext.getCurrentUserId(), id);
        return ApiResponse.success("掌握成功", null);
    }

    @GetMapping("/categories")
    public ApiResponse<List<Map<String, String>>> categories() {
        return ApiResponse.success(wrongQuestionService.categories());
    }
}
