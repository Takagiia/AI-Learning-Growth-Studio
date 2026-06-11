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
                            Map.of("role", "system", "content", systemPrompt + "\n\nIf user question has related reference materials, please answer based on them first."),
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
                    content = "Sorry, I can't answer your question now, please try again later.";
                }
            } else {
                content = "Sorry, I can't answer your question now, please try again later.";
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
            data.put("content", "Sorry, failed to call AI service, please check API key configuration or try again later.");
            data.put("createdAt", LocalDateTime.now());
            return data;
        } catch (Exception e) {
            System.err.println("Error calling DeepSeek: " + e.getMessage());
            Map<String, Object> data = new LinkedHashMap<>();
            data.put("id", "msg_" + System.currentTimeMillis());
            data.put("role", "assistant");
            data.put("content", "Sorry, system error, please try again later.");
            data.put("createdAt", LocalDateTime.now());
            return data;
        }
    }

    public List<String> quickQuestions() {
        return List.of(
                "How to prepare for postgraduate entrance exam?",
                "How to improve English learning efficiency?",
                "What is the learning roadmap for Vue3 projects?",
                "How to do time management?",
                "Any suggestions for algorithm practice?"
        );
    }
}
