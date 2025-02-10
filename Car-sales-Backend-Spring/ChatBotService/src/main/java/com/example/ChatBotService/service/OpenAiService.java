package com.example.ChatBotService.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service // 🚀 Ensure this annotation is present
public class OpenAiService {

    @Value("${spring.ai.openai.api-key}")
    private String openAiApiKey;

    @Value("${spring.ai.openai.api-url}")
    private String openAiApiUrl;

    private final RestTemplate restTemplate;

    public OpenAiService(RestTemplate restTemplate) { // Constructor injection
        this.restTemplate = restTemplate;
    }

    public String getChatResponse(String userMessage) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + openAiApiKey);
        headers.set("Content-Type", "application/json");

        Map<String, Object> request = Map.of(
                "model", "gpt-4",
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a helpful assistant."),
                        Map.of("role", "user", "content", userMessage)
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                openAiApiUrl, HttpMethod.POST, entity, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");

        return choices != null && !choices.isEmpty()
                ? (String) ((Map<String, Object>) choices.get(0).get("message")).get("content")
                : "Error: No response from OpenAI.";
    }
}
