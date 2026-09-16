import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = '/api/v1/cliente';

  constructor(private http: HttpClient) {}

  findAll(companyId?: number | null): Observable<Cliente[]> {
    let url = this.apiUrl;
    if (companyId) url += `?companyId=${companyId}`;
    return this.http.get<Cliente[]>(url);
  }

  findOne(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  create(data: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, data);
  }

  update(id: number, changes: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  search(term: string, companyId?: number | null): Observable<Cliente[]> {
    let url = `${this.apiUrl}/search?q=${encodeURIComponent(term)}`;
    if (companyId) url += `&companyId=${companyId}`;
    return this.http.get<Cliente[]>(url);
  }
}
