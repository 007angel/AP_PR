import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingreso } from '../models/ingreso.model';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  private apiUrl = '/api/v1/ingreso';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(this.apiUrl);
  }

  findOne(id: number): Observable<Ingreso> {
    return this.http.get<Ingreso>(`${this.apiUrl}/${id}`);
  }

  create(data: Ingreso): Observable<Ingreso> {
    return this.http.post<Ingreso>(this.apiUrl, data);
  }

  update(id: number, changes: Partial<Ingreso>): Observable<Ingreso> {
    return this.http.put<Ingreso>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCorrelativo(): Observable<{ correlativo: string }> {
    return this.http.get<{ correlativo: string }>(`${this.apiUrl}/correlativo`);
  }
}
