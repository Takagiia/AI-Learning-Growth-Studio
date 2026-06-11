package com.ailearning.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {
    private final WebClient webClient;
    private final RagService ragService;
    
    @Value("${app.deepseek.api-key}")
    private String apiKey;
    
    @Value("${app.deepseek.model}")
    private String model;
    
    @Value("${app.deepseek.system-prompt}")
    private String systemPrompt;

    public AiService(@Value("${app.deepseek.base-url}") String baseUrl, RagService ragService) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .build();
        this.ragService = ragService;
    }

    public Map<String, Object> chat(String question) {
        try {
            Long userId = com.ailearning.backend.common.AuthContext.getCurrentUserId();
            
            String enhancedPrompt = question;
            if (userId != null) {
                enhancedPrompt = ragService.buildRagPrompt(userId, question);
            }

            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt + "\n\n如果用户问题有相关参考资料，请优先基于参考资料回答�?),
                            Map.of("role", "user", "content", enhancedPrompt)
                    ),
                    "thinking", Map.of("type", "enabled"),
                    "reasoning_effort", "high",
                    "stream", false
            );

            Map<String, Object> response = webClient.post()
                    .uri("/chat/completions")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            String content;
            if (response != null && response.containsKey("choices")) {
                List<?> choices = (List<?>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<?, ?> choice = (Map<?, ?>) choices.get(0);
                    Map<?, ?> message = (Map<?, ?>) choice.get("message");
                    content = (String) message.get("content");
                } else {
                    content = "抱歉，我暂时无法回答你的问题，请稍后重试�?;
                }
            } else {
                content = "抱歉，我暂时无法回答你的问题，请稍后重试�?;
            }

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("id", "msg_" + System.currentTimeMillis());
            data.put("role", "assistant");
            data.put("content", content);
            data.put("createdAt", LocalDateTime.now());
            return data;

        } catch (WebClientResponseException e) {
            System.err.println("DeepSeek API Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("id", "msg_" + System.currentTimeMillis());
            data.put("role", "assistant");
            data.put("content", "抱歉，调用AI服务失败，请检查API密钥配置或稍后重试�?);
            data.put("createdAt", LocalDateTime.now());
            return data;
        } catch (Exception e) {
            System.err.println("Error calling DeepSeek: " + e.getMessage());
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("id", "msg_" + System.currentTimeMillis());
            data.put("role", "assistant");
            data.put("content", "抱歉，系统出现错误，请稍后重试�?);
            data.put("createdAt", LocalDateTime.now());
            return data;
        }
    }

    public List<String> quickQuestions() {
        return List.of(
                "如何准备考研�?,
                "怎样提高英语学习效率�?,
                "Vue3 项目学习路线是什么？",
                "如何做时间管理？",
                "算法刷题有什么建议？"
        );
    }
}
