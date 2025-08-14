import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.html',
  styleUrls: ['./chat-widget.css']
})
export class ChatWidget {
  isOpen = false;
  messages: ChatMessage[] = [];
  newMessage = '';
  messageId = 1;

  constructor() {
    // Add welcome message
    this.addMessage("Hi! I'm Loomi, your AI assistant for cotton mix planning. How can I help you today?", false);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.addMessage(this.newMessage, true);
      
      // Simulate AI response
      setTimeout(() => {
        this.generateAIResponse(this.newMessage);
      }, 1000);
      
      this.newMessage = '';
    }
  }

  formatMessageText(text: string): string {
    return text.replace(/\n/g, '<br>');
  }

  private addMessage(text: string, isUser: boolean) {
    this.messages.push({
      id: this.messageId++,
      text,
      isUser,
      timestamp: new Date()
    });
  }

  private generateAIResponse(userMessage: string) {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello! I'm here to help you with cotton mix planning, inventory management, and any questions about your cotton operations.";
    } else if (lowerMessage.includes('bale') || lowerMessage.includes('inventory')) {
      response = "I can help you with bale inventory management. You can add new bales, check current stock levels, or analyze quality metrics. What specific information do you need?";
    } else if (lowerMessage.includes('mix') || lowerMessage.includes('plan')) {
      response = "For cotton mix planning, I can help you create optimal blends based on your inventory, quality requirements, and production goals. Would you like to start a new mix plan?";
    } else if (lowerMessage.includes('quality') || lowerMessage.includes('grade')) {
      response = "I can assist with quality analysis and grading. I can help you understand fiber properties, strength metrics, and recommend quality improvements for your cotton mix.";
    } else if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
      response = "I can help you generate reports on inventory levels, mix performance, quality metrics, and production analytics. What type of report would you like?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      response = "I'm here to help! I can assist with:\n• Bale inventory management\n• Cotton mix planning\n• Quality analysis\n• Report generation\n• Production optimization\n\nJust ask me anything about your cotton operations!";
    } else {
      response = "I understand you're asking about '" + userMessage + "'. I'm here to help with cotton mix planning, inventory management, and quality analysis. Could you please provide more specific details about what you need assistance with?";
    }

    this.addMessage(response, false);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
