import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudService } from '../../../services/solicitud.service';
import { AuthService } from '../../../services/auth.service';
import { Solicitud } from '../../../models/solicitud.model';

@Component({
  selector: 'app-solicitudes-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Solicitudes</h1>
          <p>Solicitudes de productos del inventario</p>
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

      <!-- Stats Cards -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-icon pendiente">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.pendientes }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon aprobado">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.aprobadas }}</span>
            <span class="stat-label">Aprobadas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon completado">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.completadas }}</span>
            <span class="stat-label">Completadas</span>
          </div>
        </div>
      </div>

      <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Correlativo</th>
              <th>Fecha</th>
              <th>Solicitante</th>
              <th>Artículos</th>
              <th>Cant. Solicitada</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="solicitudes.length === 0">
              <td colspan="7" class="empty-row">No hay solicitudes registradas</td>
            </tr>
            <tr *ngFor="let sol of solicitudes">
              <td><strong>{{ sol.correlativo }}</strong></td>
              <td>{{ sol.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ sol.cliente?.nombre || sol.user?.name || sol.solicitante }}</td>
              <td>{{ sol.detalles?.length || 0 }} artículos</td>
              <td>{{ sol.totalSolicitado }}</td>
              <td>
                <span class="status-badge" [class]="'status-' + sol.estado">
                  {{ getEstadoLabel(sol.estado) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <a [routerLink]="['/inventory/solicitudes', sol.id]" class="btn-action">Ver</a>
                  <button
                    class="btn-action btn-success"
                    *ngIf="sol.estado === 'pendiente'"
                    (click)="updateEstado(sol.id!, 'aprobado')"
                  >Aprobar</button>
                  <button
                    class="btn-action btn-danger"
                    *ngIf="sol.estado === 'pendiente'"
                    (click)="updateEstado(sol.id!, 'rechazado')"
                  >Rechazar</button>
                </div>
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

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
    .stat-card { display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); }
    .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon.pendiente { background: var(--warning-bg); color: var(--warning-text); }
    .stat-icon.aprobado { background: var(--success-bg); color: var(--success-text); }
    .stat-icon.completado { background: var(--info-bg); color: var(--info-text); }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 22px; font-weight: 700; color: var(--text-primary); }
    .stat-label { font-size: 12px; color: var(--text-tertiary); }

    .success-message { padding: 14px 20px; background: var(--success-bg); border: 1px solid var(--success-border); border-radius: var(--radius-lg); color: var(--success-text); font-size: 14px; font-weight: 500; margin-bottom: 24px; }
    .error-message { padding: 14px 20px; background: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-lg); color: var(--danger-text); font-size: 14px; font-weight: 500; margin-bottom: 24px; }

    .table-container { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-primary); }
    .data-table td { padding: 16px; font-size: 14px; color: var(--text-primary); border-bottom: 1px solid var(--border-primary); }
    .data-table tr:last-child td { border-bottom: none; }
    .empty-row { text-align: center; color: var(--text-tertiary); padding: 40px; }

    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .status-pendiente { background: var(--warning-bg); color: var(--warning-text); }
    .status-aprobado { background: var(--success-bg); color: var(--success-text); }
    .status-rechazado { background: var(--danger-bg); color: var(--danger-text); }
    .status-completado { background: var(--info-bg); color: var(--info-text); }

    .action-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn-action { padding: 6px 12px; font-size: 12px; color: var(--accent-primary); background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition); cursor: pointer; font-weight: 500; }
    .btn-action:hover { background: var(--accent-primary); color: white; }
    .btn-success { color: var(--success-text); background: var(--success-bg); border-color: var(--success-border); }
    .btn-success:hover { background: var(--success-text); color: white; }
    .btn-danger { color: var(--danger-text); background: var(--danger-bg); border-color: var(--danger-border); }
    .btn-danger:hover { background: var(--danger); color: white; }
  `]
})
export class SolicitudesListComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  stats: any = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private solicitudService: SolicitudService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const companyId = this.authService.getCompanyId();
    this.solicitudService.findAll(companyId).subscribe({
      next: (data) => this.solicitudes = data,
      error: () => this.errorMessage = 'Error al cargar solicitudes'
    });
    this.solicitudService.getStats(companyId).subscribe({
      next: (data) => this.stats = data,
      error: () => {}
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: any = {
      pendiente: 'Pendiente',
      aprobado: 'Aprobado',
      rechazado: 'Rechazado',
      completado: 'Completado'
    };
    return labels[estado] || estado;
  }

  updateEstado(id: number, estado: string) {
    this.solicitudService.updateEstado(id, estado).subscribe({
      next: () => {
        this.successMessage = `Solicitud ${estado === 'aprobado' ? 'aprobada' : 'rechazada'} exitosamente`;
        this.loadData();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar solicitud';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}
