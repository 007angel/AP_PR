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

  findByCompany(companyId: number): Observable<Ingreso[]> {
    return this.http.get<Ingreso[]>(`${this.apiUrl}/by-company/${companyId}`);
  }

  findOne(id: number, companyId?: number): Observable<Ingreso> {
    const params: any = {};
    if (companyId) params.companyId = companyId;
    return this.http.get<Ingreso>(`${this.apiUrl}/${id}`, { params });
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

  getCorrelativo(companyId: number): Observable<{ correlativo: string }> {
    return this.http.get<{ correlativo: string }>(`${this.apiUrl}/correlativo/${companyId}`);
  }

  getStats(companyId?: number): Observable<{ total: number; pendientes: number; completados: number; cancelados: number; totalTarimas: number }> {
    const params: any = {};
    if (companyId) params.companyId = companyId;
    return this.http.get<{ total: number; pendientes: number; completados: number; cancelados: number; totalTarimas: number }>(`${this.apiUrl}/stats`, { params });
  }

  getRecent(limit: number = 5, companyId?: number): Observable<Ingreso[]> {
    const params: any = { limit };
    if (companyId) params.companyId = companyId;
    return this.http.get<Ingreso[]>(`${this.apiUrl}/recent`, { params });
  }
}
