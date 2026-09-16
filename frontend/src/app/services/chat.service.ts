import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage, ChatKnowledge, ChatSendMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = '/api/v1/chat';

  constructor(private http: HttpClient) {}

  sendMessage(data: ChatSendMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.apiUrl}/message`, data);
  }

  getHistory(userId?: number, limit: number = 20): Observable<ChatMessage[]> {
    let url = `${this.apiUrl}/history?limit=${limit}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    return this.http.get<ChatMessage[]>(url);
  }

  getFaq(): Observable<ChatKnowledge[]> {
    return this.http.get<ChatKnowledge[]>(`${this.apiUrl}/faq`);
  }

  seed(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/seed`, {});
  }
}
