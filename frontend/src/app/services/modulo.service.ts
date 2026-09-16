import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modulo } from '../models/modulo.model';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private apiUrl = '/api/v1/modulo';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl);
  }

  findActivos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.apiUrl}/activos`);
  }

  findOne(id: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.apiUrl}/${id}`);
  }

  create(data: Modulo): Observable<Modulo> {
    return this.http.post<Modulo>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Modulo>): Observable<Modulo> {
    return this.http.put<Modulo>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.apiUrl}/${id}`);
  }
}
