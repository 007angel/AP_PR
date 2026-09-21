import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnulacionService } from '../../services/anulacion.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../../shared/confirm-dialog/confirm.service';
import { Anulacion } from '../../models/anulacion.model';

@Component({
  selector: 'app-anulacion-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <app-confirm-dialog></app-confirm-dialog>

      <div *ngIf="!authorized" class="unauthorized-container">
        <div class="unauthorized-icon">🚫</div>
        <h2>No autorizado</h2>
        <p>No tiene permiso para acceder a la gestion de anulaciones.</p>
        <p>Solicite al administrador que le asigne el modulo de <strong>Anulaciones</strong>.</p>
        <a routerLink="/inventory/dashboard" class="btn-back">← Volver al Dashboard</a>
      </div>

      <ng-container *ngIf="authorized">
      <div class="page-header">
        <div class="header-content">
          <h1>Anulaciones por Autorizar</h1>
          <p>Solicitudes de anulacion de ingresos pendientes de aprobacion</p>
        </div>
        <div class="header-actions">
          <a routerLink="/dashboard" class="back-link">← Menú Principal</a>
        </div>
      </div>

      <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="filter-row">
        <button
          *ngFor="let f of filtros"
          class="filter-btn"
          [class.active]="filtro === f.value"
          (click)="filtro = f.value; applyFilter()"
        >
          {{ f.label }} ({{ countBy(f.value) }})
        </button>
      </div>

      <div class="card">
        <div class="card-body">
          <div *ngIf="isLoading" class="loading">Cargando solicitudes...</div>

          <div *ngIf="!isLoading && filtered.length === 0" class="empty-state">
            <p>No hay solicitudes {{ filtro === 'todas' ? '' : filtro + 's ' }}.</p>
          </div>

          <table *ngIf="!isLoading && filtered.length > 0" class="data-table">
            <thead>
              <tr>
                <th>Ingreso</th>
                <th>Factura</th>
                <th>Motivo</th>
                <th>Solicitado por</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of filtered">
                <td><strong>{{ s.ingreso?.correlativo || ('#' + s.ingresoId) }}</strong></td>
                <td>{{ s.ingreso?.numeroFactura || '—' }}</td>
                <td class="motivo-cell">{{ s.motivo || 'Sin motivo' }}</td>
                <td>{{ s.solicitante?.name || '—' }}</td>
                <td>{{ s.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>
                  <span class="badge" [class]="'badge-' + s.estado">{{ estadoLabel(s.estado) }}</span>
                </td>
                <td class="actions">
                  <ng-container *ngIf="s.estado === 'pendiente'">
                    <button class="btn-action btn-approve" (click)="aprobar(s)">Aprobar</button>
                    <button class="btn-action btn-reject" (click)="rechazar(s)">Rechazar</button>
                  </ng-container>
                  <button
                    *ngIf="s.estado !== 'pendiente'"
                    class="btn-icon btn-danger"
                    (click)="eliminar(s.id!)"
                    title="Eliminar solicitud"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1150px;
      margin: 0 auto;
    }

    .unauthorized-container {
      text-align: center;
      padding: 80px 24px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
    }
    .unauthorized-icon { font-size: 48px; margin-bottom: 16px; }
    .unauthorized-container h2 { font-size: 22px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px; }
    .unauthorized-container p { font-size: 14px; color: var(--text-tertiary); margin: 0 0 8px; }
    .unauthorized-container .btn-back { display: inline-block; margin-top: 20px; padding: 10px 20px; font-size: 14px; font-weight: 600; color: var(--text-secondary); background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition); }
    .unauthorized-container .btn-back:hover { background: var(--bg-hover); color: var(--text-primary); }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;

      h1 {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
      }

      p {
        font-size: 14px;
        color: var(--text-tertiary);
        margin: 4px 0 0 0;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }

      .back-link {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 14px;
        padding: 8px 12px;
        border-radius: var(--radius-md);

        &:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
      }
    }

    .success-message {
      padding: 12px 16px;
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      border-radius: var(--radius-md);
      margin-bottom: 16px;
      font-size: 14px;
    }

    .error-message {
      padding: 12px 16px;
      background: var(--danger-bg);
      border: 1px solid var(--danger-border);
      border-radius: var(--radius-md);
      margin-bottom: 16px;
      font-size: 14px;
    }

    .filter-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }

    .filter-btn {
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid var(--border-primary);
      background: var(--bg-secondary);
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;

      &.active {
        background: var(--accent-bg);
        color: var(--accent-primary);
        border-color: var(--accent-border);
      }
    }

    .card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
    }

    .card-body {
      padding: 24px;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-tertiary);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;

      th {
        text-align: left;
        padding: 12px;
        color: var(--text-secondary);
        font-weight: 600;
        border-bottom: 2px solid var(--border-primary);
      }

      td {
        padding: 12px;
        border-bottom: 1px solid var(--border-primary);
        vertical-align: middle;
      }

      .motivo-cell {
        max-width: 260px;
      }

      .actions {
        white-space: nowrap;
      }
    }

    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge-pendiente {
      background: var(--warning-bg);
      color: var(--warning-text);
      border: 1px solid var(--warning-border);
    }

    .badge-aprobada {
      background: var(--success-bg);
      color: var(--success-text);
      border: 1px solid var(--success-border);
    }

    .badge-rechazada {
      background: var(--danger-bg);
      color: var(--danger-text);
      border: 1px solid var(--danger-border);
    }

    .btn-action {
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      border-radius: var(--radius-md);
      cursor: pointer;
      border: 1px solid;
      margin-right: 6px;
    }

    .btn-approve {
      color: var(--success-text);
      background: var(--success-bg);
      border-color: var(--success-border);

      &:hover {
        background: var(--success-text);
        color: white;
      }
    }

    .btn-reject {
      color: var(--danger-text);
      background: var(--danger-bg);
      border-color: var(--danger-border);

      &:hover {
        background: var(--danger, #dc2626);
        color: white;
      }
    }

    .btn-icon {
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      color: var(--text-secondary);

      &:hover {
        background: var(--bg-tertiary);
        color: var(--danger-text);
      }
    }
  `]
})
export class AnulacionListComponent implements OnInit {
  solicitudes: Anulacion[] = [];
  filtered: Anulacion[] = [];
  filtro = 'pendiente';
  isLoading = true;
  authorized = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  filtros = [
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'aprobada', label: 'Aprobadas' },
    { value: 'rechazada', label: 'Rechazadas' },
    { value: 'todas', label: 'Todas' }
  ];

  constructor(
    private anulacionService: AnulacionService,
    private authService: AuthService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.authorized = user?.role === 'master' || user?.role === 'admin' || this.authService.hasModule('anulaciones');
    if (this.authorized) {
      this.load();
    }
  }

  load() {
    this.isLoading = true;
    const companyId = this.authService.getCompanyId();
    this.anulacionService.findAll(companyId).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar las solicitudes.';
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.filtered = this.filtro === 'todas'
      ? [...this.solicitudes]
      : this.solicitudes.filter(s => s.estado === this.filtro);
  }

  countBy(estado: string): number {
    return estado === 'todas'
      ? this.solicitudes.length
      : this.solicitudes.filter(s => s.estado === estado).length;
  }

  estadoLabel(estado: string): string {
    const labels: any = { pendiente: 'Pendiente', aprobada: 'Aprobada', rechazada: 'Rechazada' };
    return labels[estado] || estado;
  }

  aprobar(s: Anulacion) {
    this.confirmService.confirm({
      title: 'Aprobar anulacion',
      message: `¿Aprobar la anulacion del ingreso ${s.ingreso?.correlativo || '#' + s.ingresoId}? El ingreso quedara anulado y se liberara la factura.`,
      confirmText: 'Si, aprobar',
      cancelText: 'Cancelar',
      danger: false
    }).subscribe(ok => {
      if (!ok) {
        return;
      }
      this.anulacionService.aprobar(s.id!, this.authService.getCompanyId()).subscribe({
        next: () => {
          this.showSuccess('Anulacion aprobada. El ingreso quedo anulado.');
          this.load();
        },
        error: (err) => {
          this.showError(err.error?.message || 'Error al aprobar.');
        }
      });
    });
  }

  rechazar(s: Anulacion) {
    this.confirmService.confirm({
      title: 'Rechazar anulacion',
      message: `¿Rechazar la solicitud de anulacion del ingreso ${s.ingreso?.correlativo || '#' + s.ingresoId}? El ingreso seguira vigente.`,
      confirmText: 'Si, rechazar',
      cancelText: 'Cancelar'
    }).subscribe(ok => {
      if (!ok) {
        return;
      }
      this.anulacionService.rechazar(s.id!, this.authService.getCompanyId()).subscribe({
        next: () => {
          this.showSuccess('Solicitud rechazada.');
          this.load();
        },
        error: (err) => {
          this.showError(err.error?.message || 'Error al rechazar.');
        }
      });
    });
  }

  eliminar(id: number) {
    this.confirmService.confirm({
      title: 'Eliminar solicitud',
      message: '¿Eliminar esta solicitud del historial?',
      confirmText: 'Si, eliminar',
      cancelText: 'Cancelar'
    }).subscribe(ok => {
      if (!ok) {
        return;
      }
      this.anulacionService.delete(id, this.authService.getCompanyId()).subscribe({
        next: () => {
          this.solicitudes = this.solicitudes.filter(s => s.id !== id);
          this.applyFilter();
          this.showSuccess('Solicitud eliminada.');
        },
        error: (err) => {
          this.showError(err.error?.message || 'Error al eliminar.');
        }
      });
    });
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => this.successMessage = null, 4000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.successMessage = null;
    setTimeout(() => this.errorMessage = null, 5000);
  }
}
