import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8086/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    const requestBody = { message };

    return this.http.post<{ response: string }>(this.apiUrl, requestBody, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(map(res => res.response)); 
  }
}
