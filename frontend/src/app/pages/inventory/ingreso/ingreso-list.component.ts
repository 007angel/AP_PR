import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IngresoService } from '../../../services/ingreso.service';
import { Ingreso } from '../../../models/ingreso.model';

@Component({
  selector: 'app-ingreso-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Ingresos</h1>
          <p>Gestion de entradas de productos al inventario</p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/dashboard" class="btn-back">
            ← Dashboard
          </a>
          <button class="btn-primary" routerLink="/inventory/ingreso/new">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo Ingreso
          </button>
        </div>
      </div>

      <div *ngIf="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Correlativo</th>
              <th>Factura</th>
              <th>Fecha Ingreso</th>
              <th>Fecha Digitacion</th>
              <th>Tarimas</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="ingresos.length === 0">
              <td colspan="8" class="empty-row">No hay ingresos registrados</td>
            </tr>
            <tr *ngFor="let ingreso of ingresos">
              <td>{{ ingreso.correlativo }}</td>
              <td>{{ ingreso.numeroFactura }}</td>
              <td>{{ ingreso.fechaIngreso | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ ingreso.fechaDigitacion | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ ingreso.cantidadTarimas }}</td>
              <td>{{ ingreso.usuarioDigito }}</td>
              <td>
                <span class="status-badge" [class]="'status-' + ingreso.status">
                  {{ getEstadoLabel(ingreso.status || 'pendiente') }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <a [routerLink]="['/inventory/ingreso', ingreso.id]" class="btn-action">Ver</a>
                  <button class="btn-action btn-delete" (click)="deleteIngreso(ingreso.id!)">Eliminar</button>
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
    
    .success-message {
      padding: 14px 20px;
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      border-radius: var(--radius-lg);
      color: var(--success-text);
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 24px;
    }

    .error-message {
      padding: 14px 20px;
      background: var(--danger-bg);
      border: 1px solid var(--danger-border);
      border-radius: var(--radius-lg);
      color: var(--danger-text);
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 24px;
    }

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
    .action-buttons { display: flex; gap: 8px; }
    .btn-action { padding: 6px 12px; font-size: 12px; color: var(--accent-primary); background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition); cursor: pointer; }
    .btn-action:hover { background: var(--accent-primary); color: white; }
    .btn-delete { color: var(--danger-text); background: var(--danger-bg); border-color: var(--danger-border); }
    .btn-delete:hover { background: var(--danger); color: white; }
  `]
})
export class IngresoListComponent implements OnInit {
  ingresos: Ingreso[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(private ingresoService: IngresoService) {}

  ngOnInit() {
    this.loadIngresos();
  }

  loadIngresos() {
    this.ingresoService.findAll().subscribe({
      next: (ingresos) => {
        this.ingresos = ingresos;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los ingresos';
      }
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: any = { pendiente: 'Pendiente', completado: 'Completado', cancelado: 'Cancelado' };
    return labels[estado] || estado;
  }

  deleteIngreso(id: number) {
    if (confirm('¿Estas seguro de eliminar este ingreso?')) {
      this.ingresoService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Ingreso eliminado correctamente';
          this.loadIngresos();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: () => {
          this.errorMessage = 'Error al eliminar el ingreso';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }
}
