package com.ailearning.backend.controller;

import com.ailearning.backend.common.ApiResponse;
import com.ailearning.backend.common.AuthContext;
import com.ailearning.backend.service.ResourceService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resource")
public class ResourceController {
    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/list")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize
    ) {
        return ApiResponse.success(resourceService.list(AuthContext.getCurrentUserId(), category, keyword, type, page, pageSize));
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<Map<String, Object>> detail(@PathVariable Long id) {
        var res = resourceService.detail(AuthContext.getCurrentUserId(), id);
        return ApiResponse.success(Map.of(
                "id", res.getId(),
                "title", res.getTitle(),
                "type", res.getType(),
                "category", res.getCategory(),
                "size", res.getSize(),
                "url", res.getUrl(),
                "description", res.getDescription(),
                "downloadCount", res.getDownloadCount(),
                "createTime", res.getCreatedAt().toString()
        ));
    }

    @PostMapping("/upload")
    public ApiResponse<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "description", required = false) String description
    ) {
        var res = resourceService.upload(AuthContext.getCurrentUserId(), file, title, category, description);
        return ApiResponse.success("上传成功", Map.of("id", res.getId()));
    }

    @PostMapping("/create")
    public ApiResponse<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        var res = resourceService.create(AuthContext.getCurrentUserId(), body);
        return ApiResponse.success("上传成功", Map.of("id", res.getId()));
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        resourceService.delete(AuthContext.getCurrentUserId(), id);
        return ApiResponse.success("删除成功", null);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        var res = resourceService.incrementDownload(AuthContext.getCurrentUserId(), id);
        try {
            Path filePath = Paths.get(res.getUrl());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/octet-stream";
            String encodedFileName = URLEncoder.encode(res.getTitle(), StandardCharsets.UTF_8)
                    .replaceAll("\\+", "%20");

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename*=UTF-8''" + encodedFileName)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/categories")
    public ApiResponse<List<Map<String, String>>> categories() {
        return ApiResponse.success(resourceService.categories());
    }
}
