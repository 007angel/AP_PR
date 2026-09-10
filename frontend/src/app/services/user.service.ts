import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/v1/user';

  constructor(private http: HttpClient) { }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  findOne(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(data: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }

  update(id: number, changes: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { email });
  }

  updateModules(id: number, modules: string[]): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/modules`, { modules });
  }
}
