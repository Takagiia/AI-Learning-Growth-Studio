package com.ailearning.backend.controller;

import com.ailearning.backend.common.ApiResponse;
import com.ailearning.backend.common.AuthContext;
import com.ailearning.backend.entity.Note;
import com.ailearning.backend.service.NoteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/note")
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping("/list")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(noteService.list(AuthContext.getCurrentUserId(), category, keyword));
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<Note> detail(@PathVariable Long id) {
        return ApiResponse.success(noteService.detail(AuthContext.getCurrentUserId(), id));
    }

    @PostMapping("/create")
    public ApiResponse<Note> create(@RequestBody Map<String, Object> body) {
        return ApiResponse.success("创建成功", noteService.create(AuthContext.getCurrentUserId(), body));
    }

    @PutMapping("/update/{id}")
    public ApiResponse<Note> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ApiResponse.success("更新成功", noteService.update(AuthContext.getCurrentUserId(), id, body));
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        noteService.delete(AuthContext.getCurrentUserId(), id);
        return ApiResponse.success("删除成功", null);
    }

    @GetMapping("/categories")
    public ApiResponse<List<Map<String, String>>> categories() {
        return ApiResponse.success(noteService.categories());
    }
}
