import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solicitudes-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Solicitudes</h1>
          <p>Gestion de solicitudes de productos</p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/dashboard" class="btn-back">
            ← Dashboard
          </a>
          <button class="btn-primary" routerLink="/inventory/solicitudes/new">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nueva Solicitud
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Solicitante</th>
              <th>Productos</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="solicitudes.length === 0">
              <td colspan="7" class="empty-row">No hay solicitudes registradas</td>
            </tr>
            <tr *ngFor="let solicitud of solicitudes">
              <td>{{ solicitud.id }}</td>
              <td>{{ solicitud.fecha | date:'dd/MM/yyyy' }}</td>
              <td>{{ solicitud.solicitante }}</td>
              <td>{{ solicitud.productos }}</td>
              <td>
                <span class="priority-badge" [class]="'priority-' + solicitud.prioridad">
                  {{ getPrioridadLabel(solicitud.prioridad) }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class]="'status-' + solicitud.estado">
                  {{ getEstadoLabel(solicitud.estado) }}
                </span>
              </td>
              <td>
                <a [routerLink]="['/inventory/solicitudes', solicitud.id]" class="btn-action">Ver Detalle</a>
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
    .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; color: white; background: var(--accent-primary); border: none; border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); text-decoration: none; }
    .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
    .table-container { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-primary); }
    .data-table td { padding: 16px; font-size: 14px; color: var(--text-primary); border-bottom: 1px solid var(--border-primary); }
    .data-table tr:last-child td { border-bottom: none; }
    .empty-row { text-align: center; color: var(--text-tertiary); padding: 40px !important; }
    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .status-pendiente { background: var(--warning-bg); color: var(--warning-text); }
    .status-aprobado { background: var(--success-bg); color: var(--success-text); }
    .status-rechazado { background: var(--danger-bg); color: var(--danger-text); }
    .priority-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .priority-alta { background: var(--danger-bg); color: var(--danger-text); }
    .priority-media { background: var(--warning-bg); color: var(--warning-text); }
    .priority-baja { background: var(--success-bg); color: var(--success-text); }
    .btn-action { padding: 6px 12px; font-size: 12px; color: var(--accent-primary); background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition); }
    .btn-action:hover { background: var(--accent-primary); color: white; }
  `]
})
export class SolicitudesListComponent implements OnInit {
  solicitudes: any[] = [];

  ngOnInit() {}

  getEstadoLabel(estado: string): string {
    const labels: any = { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado' };
    return labels[estado] || estado;
  }

  getPrioridadLabel(prioridad: string): string {
    const labels: any = { alta: 'Alta', media: 'Media', baja: 'Baja' };
    return labels[prioridad] || prioridad;
  }
}
