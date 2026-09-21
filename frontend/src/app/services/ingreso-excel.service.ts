import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoExcelService {
  private apiUrl = '/api/v1/ingreso-excel';

  constructor(private http: HttpClient) {}

  downloadTemplate(companyId: number): void {
    const url = `${this.apiUrl}/template/${companyId || 0}`;
    window.open(url, '_blank');
  }

  uploadExcel(file: File, companyId: number, userId?: number, userRole?: string): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file);
    if (userId) {
      formData.append('userId', String(userId));
    }
    if (userRole) {
      formData.append('userRole', userRole);
    }
    return this.http.post<any>(`${this.apiUrl}/upload/${companyId || 0}`, formData);
  }
}
