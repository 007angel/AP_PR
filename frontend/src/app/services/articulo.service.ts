import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Articulo } from '../models/articulo.model';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  private apiUrl = '/api/v1/articulo';

  constructor(private http: HttpClient) {}

  findAll(companyId?: number | null): Observable<Articulo[]> {
    let url = this.apiUrl;
    if (companyId) url += `?companyId=${companyId}`;
    return this.http.get<Articulo[]>(url);
  }

  findOne(id: number): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.apiUrl}/${id}`);
  }

  create(data: Articulo): Observable<Articulo> {
    return this.http.post<Articulo>(this.apiUrl, data);
  }

  update(id: number, changes: Partial<Articulo>): Observable<Articulo> {
    return this.http.put<Articulo>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  search(term: string, companyId?: number | null): Observable<Articulo[]> {
    let url = `${this.apiUrl}/search?q=${encodeURIComponent(term)}`;
    if (companyId) url += `&companyId=${companyId}`;
    return this.http.get<Articulo[]>(url);
  }
}
