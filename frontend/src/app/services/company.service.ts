import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = '/api/v1/company';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  create(data: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, data);
  }

  register(company: Partial<Company>, admin: { name: string; email: string; password: string }): Observable<{ company: Company; admin: User }> {
    return this.http.post<{ company: Company; admin: User }>(`${this.apiUrl}/register`, { company, admin });
  }

  update(id: number, changes: Partial<Company>): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUsers(companyId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${companyId}/users`);
  }

  linkUser(companyId: number, userId: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${companyId}/users/${userId}`, {});
  }

  unlinkUser(companyId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${companyId}/users/${userId}`);
  }
}
