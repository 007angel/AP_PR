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

  findAll(): Observable<Anulacion[]> {
    return this.http.get<Anulacion[]>(this.apiUrl);
  }

  create(data: { ingresoId: number; motivo?: string | null; solicitadoPor?: number | null }): Observable<Anulacion> {
    return this.http.post<Anulacion>(this.apiUrl, data);
  }

  aprobar(id: number): Observable<Anulacion> {
    return this.http.post<Anulacion>(`${this.apiUrl}/${id}/aprobar`, {});
  }

  rechazar(id: number): Observable<Anulacion> {
    return this.http.post<Anulacion>(`${this.apiUrl}/${id}/rechazar`, {});
  }

  delete(id: number): Observable<{ message: string; id: number }> {
    return this.http.delete<{ message: string; id: number }>(`${this.apiUrl}/${id}`);
  }
}
