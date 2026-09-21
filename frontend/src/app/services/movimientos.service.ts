import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MovimientosResumen {
  stats: {
    totalIngresado: number;
    totalEntregado: number;
    totalMermas: number;
    stockDisponible: number;
    articulosConStock: number;
    solicitudesPendientes: number;
    solicitudesAprobadas: number;
  };
  stock: StockArticulo[];
  ingresos: any[];
  solicitudes: any[];
  salidas: any[];
}

export interface StockArticulo {
  articulo: string;
  totalIngresado: number;
  totalEntregado: number;
  totalMermas: number;
  stockDisponible: number;
  ingresosVinculados: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private apiUrl = '/api/v1/movimientos';

  constructor(private http: HttpClient) {}

  getResumen(companyId?: number): Observable<MovimientosResumen> {
    const params: any = {};
    if (companyId) params.companyId = companyId;
    return this.http.get<MovimientosResumen>(this.apiUrl, { params });
  }
}
