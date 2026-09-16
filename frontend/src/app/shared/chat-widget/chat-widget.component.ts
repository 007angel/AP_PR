import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { ChatMessage } from '../../models/chat.model';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Button -->
    <div class="chat-fab" (click)="toggleChat()" [class.active]="isOpen">
      <svg *ngIf="!isOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg *ngIf="isOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span class="fab-badge" *ngIf="unreadCount > 0 && !isOpen">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </div>

    <!-- Chat Window -->
    <div class="chat-window" [class.open]="isOpen">
      <!-- Header -->
      <div class="chat-header">
        <div class="header-info">
          <div class="header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div>
            <h3>Soporte TechSolutions</h3>
            <span class="status-dot">
              <span class="dot"></span>
              En línea
            </span>
          </div>
        </div>
        <button class="header-close" (click)="toggleChat()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="chat-messages" #messagesContainer>
        <div class="welcome-msg" *ngIf="messages.length === 0">
          <div class="welcome-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <p class="welcome-title">Hola! Soy tu asistente</p>
          <p class="welcome-text">Pregúntame cualquier cosa sobre el sistema.</p>
          <div class="quick-actions">
            <button *ngFor="let q of quickQuestions" class="quick-btn" (click)="sendQuickQuestion(q)">
              {{ q }}
            </button>
          </div>
        </div>

        <div *ngFor="let msg of messages" class="message-wrapper">
          <div class="message user-message">
            <div class="msg-bubble">{{ msg.pregunta }}</div>
          </div>
          <div class="message bot-message">
            <div class="bot-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div class="msg-bubble">{{ msg.respuesta }}</div>
          </div>
        </div>

        <div class="typing-indicator" *ngIf="isTyping">
          <div class="message bot-message">
            <div class="bot-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div class="msg-bubble">
              <span class="dot-typing"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="chat-input-area">
        <div class="input-wrapper">
          <input
            type="text"
            [(ngModel)]="currentMessage"
            (keydown.enter)="sendMessage()"
            placeholder="Escribe tu pregunta..."
            [disabled]="isTyping"
          />
          <button class="send-btn" (click)="sendMessage()" [disabled]="!currentMessage.trim() || isTyping">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <span class="powered-by">Asistente TechSolutions</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .chat-fab {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-primary, #2563eb), var(--accent-hover, #1d4ed8));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;

      &:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 24px rgba(37, 99, 235, 0.5);
      }

      &.active {
        background: var(--bg-tertiary, #f1f5f9);
        color: var(--text-primary, #0f172a);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);

        &:hover {
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
        }
      }

      .fab-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #ef4444;
        color: white;
        font-size: 11px;
        font-weight: 700;
        min-width: 20px;
        height: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 5px;
        border: 2px solid white;
      }
    }

    .chat-window {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 380px;
      height: 540px;
      background: var(--bg-secondary, #ffffff);
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px var(--border-primary, #e2e8f0);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(16px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }
    }

    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 18px;
      background: linear-gradient(135deg, var(--accent-primary, #2563eb), var(--accent-hover, #1d4ed8));
      color: white;

      .header-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h3 {
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 2px 0;
        }

        .status-dot {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          opacity: 0.9;

          .dot {
            width: 7px;
            height: 7px;
            background: #4ade80;
            border-radius: 50%;
            animation: pulse-dot 2s infinite;
          }
        }
      }

      .header-close {
        width: 32px;
        height: 32px;
        border: none;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      }
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--bg-primary, #f8fafc);

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border-secondary, #cbd5e1);
        border-radius: 2px;
      }
    }

    .welcome-msg {
      text-align: center;
      padding: 20px 8px;

      .welcome-icon {
        width: 56px;
        height: 56px;
        background: var(--accent-light, #eff6ff);
        color: var(--accent-primary, #2563eb);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 14px;
      }

      .welcome-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary, #0f172a);
        margin: 0 0 6px 0;
      }

      .welcome-text {
        font-size: 13px;
        color: var(--text-tertiary, #64748b);
        margin: 0 0 18px 0;
      }

      .quick-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .quick-btn {
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 500;
          color: var(--accent-primary, #2563eb);
          background: var(--accent-light, #eff6ff);
          border: 1px solid var(--accent-border, #bfdbfe);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;

          &:hover {
            background: var(--accent-primary, #2563eb);
            color: white;
            border-color: var(--accent-primary, #2563eb);
          }
        }
      }
    }

    .message-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .message {
      display: flex;
      align-items: flex-end;
      gap: 8px;

      &.user-message {
        justify-content: flex-end;
      }

      &.bot-message {
        justify-content: flex-start;
      }
    }

    .bot-avatar {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, var(--accent-primary, #2563eb), var(--accent-hover, #1d4ed8));
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .msg-bubble {
      max-width: 260px;
      padding: 10px 14px;
      font-size: 13px;
      line-height: 1.5;
      border-radius: 14px;
      word-wrap: break-word;
    }

    .user-message .msg-bubble {
      background: var(--accent-primary, #2563eb);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .bot-message .msg-bubble {
      background: var(--bg-secondary, #ffffff);
      color: var(--text-primary, #0f172a);
      border: 1px solid var(--border-primary, #e2e8f0);
      border-bottom-left-radius: 4px;
    }

    .typing-indicator .dot-typing {
      display: inline-block;
      width: 6px;
      height: 6px;
      background: var(--text-muted, #94a3b8);
      border-radius: 50%;
      animation: dot-bounce 1.4s infinite ease-in-out;
      margin: 0 2px;

      &::before, &::after {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background: var(--text-muted, #94a3b8);
        border-radius: 50%;
        animation: dot-bounce 1.4s infinite ease-in-out;
      }

      &::before { margin-right: 3px; animation-delay: -0.32s; }
      &::after { margin-left: 3px; animation-delay: 0.32s; }
    }

    @keyframes dot-bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    .chat-input-area {
      padding: 12px 16px 14px;
      border-top: 1px solid var(--border-primary, #e2e8f0);
      background: var(--bg-secondary, #ffffff);

      .input-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 4px 4px 14px;
        background: var(--bg-tertiary, #f1f5f9);
        border-radius: 12px;
        border: 1px solid var(--border-primary, #e2e8f0);
        transition: border-color 0.2s;

        &:focus-within {
          border-color: var(--accent-primary, #2563eb);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 13px;
          color: var(--text-primary, #0f172a);
          outline: none;
          padding: 8px 0;

          &::placeholder {
            color: var(--text-muted, #94a3b8);
          }

          &:disabled {
            opacity: 0.6;
          }
        }

        .send-btn {
          width: 34px;
          height: 34px;
          border: none;
          background: var(--accent-primary, #2563eb);
          color: white;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;

          &:hover:not(:disabled) {
            background: var(--accent-hover, #1d4ed8);
            transform: scale(1.05);
          }

          &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
        }
      }

      .powered-by {
        display: block;
        text-align: center;
        font-size: 11px;
        color: var(--text-muted, #94a3b8);
        margin-top: 8px;
      }
    }

    @media (max-width: 480px) {
      .chat-window {
        width: calc(100vw - 32px);
        right: -8px;
        height: calc(100vh - 120px);
        max-height: 540px;
      }
    }
  `]
})
export class ChatWidgetComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  currentMessage = '';
  messages: ChatMessage[] = [];
  isTyping = false;
  unreadCount = 0;
  private shouldScroll = false;

  quickQuestions = [
    '¿Cómo crear un usuario?',
    '¿Qué es el inventario?',
    '¿Cómo exportar reportes?',
    '¿Qué es TechSolutions?'
  ];

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.chatService.seed().subscribe({ error: () => {} });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unreadCount = 0;
      this.shouldScroll = true;
    }
  }

  sendQuickQuestion(question: string) {
    this.currentMessage = question;
    this.sendMessage();
  }

  sendMessage() {
    const text = this.currentMessage.trim();
    if (!text || this.isTyping) return;

    const userMsg: ChatMessage = { pregunta: text, respuesta: '' };
    this.messages.push(userMsg);
    this.currentMessage = '';
    this.isTyping = true;
    this.shouldScroll = true;

    const userId = this.authService.getUser()?.id;

    this.chatService.sendMessage({ pregunta: text, userId }).subscribe({
      next: (response) => {
        this.messages[this.messages.length - 1].respuesta = response.respuesta;
        this.isTyping = false;
        this.shouldScroll = true;
        if (!this.isOpen) {
          this.unreadCount++;
        }
      },
      error: () => {
        this.messages[this.messages.length - 1].respuesta = 'Error al conectar con el soporte. Intenta de nuevo.';
        this.isTyping = false;
        this.shouldScroll = true;
      }
    });
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
