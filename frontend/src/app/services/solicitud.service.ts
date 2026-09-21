import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud, CreateSolicitud, AvailableArticle } from '../models/solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = '/api/v1/solicitud';

  constructor(private http: HttpClient) {}

  findAll(companyId?: number | null): Observable<Solicitud[]> {
    let url = this.apiUrl;
    if (companyId) url += `?companyId=${companyId}`;
    return this.http.get<Solicitud[]>(url);
  }

  findOne(id: number, companyId?: number | null): Observable<Solicitud> {
    const params: any = {};
    if (companyId) params.companyId = companyId;
    return this.http.get<Solicitud>(`${this.apiUrl}/${id}`, { params });
  }

  create(data: CreateSolicitud): Observable<{ solicitud: Solicitud; detalles: any[] }> {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, changes: any): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/${id}`, changes);
  }

  updateEstado(id: number, estado: string, companyId?: number | null): Observable<Solicitud> {
    return this.http.patch<Solicitud>(`${this.apiUrl}/${id}/estado`, { estado, companyId });
  }

  delete(id: number, companyId?: number | null): Observable<any> {
    const params: any = {};
    if (companyId) params.companyId = companyId;
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { params });
  }

  getAvailableArticles(companyId?: number | null): Observable<AvailableArticle[]> {
    let url = `${this.apiUrl}/available-articles`;
    if (companyId) url += `?companyId=${companyId}`;
    return this.http.get<AvailableArticle[]>(url);
  }

  getStats(companyId?: number | null): Observable<any> {
    let url = `${this.apiUrl}/stats`;
    if (companyId) url += `?companyId=${companyId}`;
    return this.http.get<any>(url);
  }

  findByIngreso(ingresoId: number, companyId?: number | null): Observable<Solicitud[]> {
    const params: any = {};
    if (companyId) params.companyId = companyId;
    return this.http.get<Solicitud[]>(`${this.apiUrl}/by-ingreso/${ingresoId}`, { params });
  }

  updateDetalle(detalleId: number, cantidadEntregada: number, companyId?: number | null): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/detalle/${detalleId}`, { cantidadEntregada, companyId });
  }
}
