package com.example.ChatBotService.controller;

import com.example.ChatBotService.service.OpenAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ChatController {

    private final OpenAiService openAiService;

    // 🚀 Constructor Injection
    public ChatController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }


    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String response = openAiService.getChatResponse(message);
        return ResponseEntity.ok(Map.of("response", response));
    }

}
