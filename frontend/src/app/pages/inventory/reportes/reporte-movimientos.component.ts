import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reporte-movimientos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Reporte de Movimientos</h1>
          <p>Historial completo de movimientos de inventario</p>
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
          <label>Tipo</label>
          <select class="form-input">
            <option value="">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="salida">Salidas</option>
          </select>
        </div>
        <button class="btn-filter">Filtrar</button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="movimientos.length === 0">
              <td colspan="6" class="empty-row">No hay movimientos para mostrar</td>
            </tr>
            <tr *ngFor="let movimiento of movimientos">
              <td>{{ movimiento.id }}</td>
              <td>{{ movimiento.fecha | date:'dd/MM/yyyy' }}</td>
              <td>
                <span class="type-badge" [class]="'type-' + movimiento.tipo">
                  {{ movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Salida' }}
                </span>
              </td>
              <td>{{ movimiento.producto }}</td>
              <td>{{ movimiento.cantidad }}</td>
              <td>{{ movimiento.responsable }}</td>
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
    .type-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .type-ingreso { background: var(--success-bg); color: var(--success-text); }
    .type-salida { background: var(--danger-bg); color: var(--danger-text); }
  `]
})
export class ReporteMovimientosComponent implements OnInit {
  movimientos: any[] = [];

  ngOnInit() {}

  exportarReporte() {
    // TODO: Implement export functionality
    alert('Funcion de exportar en desarrollo');
  }
}
