import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Anulacion } from '../models/anulacion.model';

@Injectable({
  providedIn: 'root'
})
export class AnulacionService {
  private apiUrl = '/api/v1/anulacion';

  constructor(private http: HttpClient) { }

  findAll(companyId?: number | null): Observable<Anulacion[]> {
    const params: any = {};
    if (companyId) params.companyId = companyId;
    return this.http.get<Anulacion[]>(this.apiUrl, { params });
  }

  create(data: { ingresoId: number; motivo?: string | null; solicitadoPor?: number | null; companyId?: number | null }): Observable<Anulacion> {
    return this.http.post<Anulacion>(this.apiUrl, data);
  }

  aprobar(id: number, companyId?: number | null): Observable<Anulacion> {
    return this.http.post<Anulacion>(`${this.apiUrl}/${id}/aprobar`, { companyId });
  }

  rechazar(id: number, companyId?: number | null): Observable<Anulacion> {
    return this.http.post<Anulacion>(`${this.apiUrl}/${id}/rechazar`, { companyId });
  }

  delete(id: number, companyId?: number | null): Observable<{ message: string; id: number }> {
    const params: any = {};
    if (companyId) params.companyId = companyId;
    return this.http.delete<{ message: string; id: number }>(`${this.apiUrl}/${id}`, { params });
  }
}
