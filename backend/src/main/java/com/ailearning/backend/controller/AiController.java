package com.ailearning.backend.controller;

import com.ailearning.backend.common.ApiResponse;
import com.ailearning.backend.service.AiService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ApiResponse<Map<String, Object>> chat(@RequestBody Map<String, Object> body) {
        String question = body == null ? null : String.valueOf(body.get("question"));
        return ApiResponse.success(aiService.chat(question));
    }

    @GetMapping("/quick-questions")
    public ApiResponse<List<String>> quickQuestions() {
        return ApiResponse.success(aiService.quickQuestions());
    }
}
