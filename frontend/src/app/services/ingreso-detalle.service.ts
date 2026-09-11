import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngresoDetalle } from '../models/ingreso-detalle.model';

@Injectable({
  providedIn: 'root'
})
export class IngresoDetalleService {
  private apiUrl = '/api/v1/ingreso-detalle';

  constructor(private http: HttpClient) { }

  findAll(): Observable<IngresoDetalle[]> {
    return this.http.get<IngresoDetalle[]>(this.apiUrl);
  }

  findOne(id: number): Observable<IngresoDetalle> {
    return this.http.get<IngresoDetalle>(`${this.apiUrl}/${id}`);
  }

  findByIngreso(ingresoId: number): Observable<IngresoDetalle[]> {
    return this.http.get<IngresoDetalle[]>(`${this.apiUrl}/ingreso/${ingresoId}`);
  }

  create(data: IngresoDetalle): Observable<IngresoDetalle> {
    return this.http.post<IngresoDetalle>(this.apiUrl, data);
  }

  update(id: number, changes: Partial<IngresoDetalle>): Observable<IngresoDetalle> {
    return this.http.put<IngresoDetalle>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  deleteByIngreso(ingresoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ingreso/${ingresoId}`);
  }
}
