import { Component } from '@angular/core';
import { ChatService } from '../services/chatbot.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage: string = '';
  messages: { sender: string, text: string }[] = [];
  isChatOpen = false; 
  isLoading: boolean = false;
   

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ sender: 'user', text: this.userMessage });
    this.isLoading = true;

    this.chatService.sendMessage(this.userMessage).subscribe({
      next: (response) => {
        this.messages.push({ sender: 'bot', text: response });
      },
      error: () => {
        this.messages.push({ sender: 'bot', text: 'Error communicating with chatbot.' });
      },
      complete: () => {
        this.isLoading = false; 
      }
    });

    this.userMessage = '';
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;

   
    if (this.isChatOpen && this.messages.length === 0) {
      setTimeout(() => {
        this.messages.push({
          sender: 'bot',
          text: 'Welcome to CarHub Chatbot. You can ask your queries!'
        });
      }, 500); 
    }
  }
}
