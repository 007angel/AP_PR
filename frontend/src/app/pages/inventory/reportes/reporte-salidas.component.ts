import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reporte-salidas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Reporte de Salidas</h1>
          <p>Historial completo de salidas del inventario</p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/dashboard" class="btn-back">
            ← Dashboard
          </a>
          <button class="btn-primary" (click)="exportarReporte()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Exportar
          </button>
        </div>
      </div>

      <div class="filters-bar">
        <div class="filter-group">
          <label>Fecha Inicio</label>
          <input type="date" class="form-input" />
        </div>
        <div class="filter-group">
          <label>Fecha Fin</label>
          <input type="date" class="form-input" />
        </div>
        <div class="filter-group">
          <label>Destino</label>
          <input type="text" class="form-input" placeholder="Buscar destino..." />
        </div>
        <button class="btn-filter">Filtrar</button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Destino</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="salidas.length === 0">
              <td colspan="6" class="empty-row">No hay salidas para mostrar</td>
            </tr>
            <tr *ngFor="let salida of salidas">
              <td>{{ salida.id }}</td>
              <td>{{ salida.fecha | date:'dd/MM/yyyy' }}</td>
              <td>{{ salida.destino }}</td>
              <td>{{ salida.productos }}</td>
              <td>{{ salida.total | currency }}</td>
              <td>
                <span class="status-badge" [class]="'status-' + salida.estado">
                  {{ getEstadoLabel(salida.estado) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .header-content h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
    .header-content p { font-size: 14px; color: var(--text-tertiary); margin: 0; }
    .header-actions { display: flex; gap: 12px; align-items: center; }
    .btn-back { padding: 12px 24px; font-size: 14px; font-weight: 600; color: var(--text-secondary); background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition); }
    .btn-back:hover { background: var(--bg-hover); color: var(--text-primary); border-color: var(--accent-primary); }
    .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; color: white; background: var(--accent-primary); border: none; border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); }
    .btn-primary:hover { background: var(--accent-hover); }
    .filters-bar { display: flex; gap: 16px; align-items: flex-end; margin-bottom: 24px; padding: 20px; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); }
    .filter-group { display: flex; flex-direction: column; gap: 6px; }
    .filter-group label { font-size: 12px; font-weight: 600; color: var(--text-tertiary); }
    .form-input { padding: 10px 14px; font-size: 14px; border: 1px solid var(--border-primary); border-radius: var(--radius-md); background: var(--bg-tertiary); color: var(--text-primary); }
    .btn-filter { padding: 10px 20px; font-size: 14px; font-weight: 600; color: white; background: var(--accent-primary); border: none; border-radius: var(--radius-md); cursor: pointer; }
    .btn-filter:hover { background: var(--accent-hover); }
    .table-container { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-primary); }
    .data-table td { padding: 16px; font-size: 14px; color: var(--text-primary); border-bottom: 1px solid var(--border-primary); }
    .data-table tr:last-child td { border-bottom: none; }
    .empty-row { text-align: center; color: var(--text-tertiary); padding: 40px !important; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .status-pendiente { background: var(--warning-bg); color: var(--warning-text); }
    .status-completado { background: var(--success-bg); color: var(--success-text); }
    .status-cancelado { background: var(--danger-bg); color: var(--danger-text); }
  `]
})
export class ReporteSalidasComponent implements OnInit {
  salidas: any[] = [];

  ngOnInit() {}

  getEstadoLabel(estado: string): string {
    const labels: any = { pendiente: 'Pendiente', completado: 'Completado', cancelado: 'Cancelado' };
    return labels[estado] || estado;
  }

  exportarReporte() {
    alert('Funcion de exportar en desarrollo');
  }
}
