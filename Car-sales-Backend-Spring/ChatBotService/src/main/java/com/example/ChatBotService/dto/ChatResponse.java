package com.example.ChatBotService.dto;

import java.util.List;
import java.util.Map;

public class ChatResponse {
    private List<Choice> choices;

  
    public static class Choice {
        private Map<String, String> message;

        public Map<String, String> getMessage() {
            return message;
        }

        public void setMessage(Map<String, String> message) {
            this.message = message;
        }
        
    }


    public List<Choice> getChoices() {
        return choices;
    }


    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }
    
    
}
