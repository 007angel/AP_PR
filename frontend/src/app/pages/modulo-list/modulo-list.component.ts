import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ModuloService } from '../../services/modulo.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../../shared/confirm-dialog/confirm.service';
import { Modulo } from '../../models/modulo.model';

@Component({
  selector: 'app-modulo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <app-confirm-dialog></app-confirm-dialog>
      <div class="page-header">
        <div class="header-content">
          <h1>Mantenimiento de Modulos</h1>
          <p>Crear y administrar los modulos del menu del sistema</p>
        </div>
        <div class="header-actions">
          <a routerLink="/dashboard" class="back-link">← Menú Principal</a>
          <button class="btn-primary" routerLink="/modulos/new">+ Nuevo Modulo</button>
        </div>
      </div>

      <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="card">
        <div class="card-body">
          <div class="filter-row">
            <input
              type="text"
              [(ngModel)]="filter"
              (ngModelChange)="applyFilter()"
              placeholder="Buscar por nombre o ruta..."
              class="filter-input"
            />
          </div>

          <div *ngIf="isLoading" class="loading">Cargando modulos...</div>

          <div *ngIf="!isLoading && filteredModulos.length === 0" class="empty-state">
            <p>No hay modulos registrados.</p>
            <button class="btn-primary" routerLink="/modulos/new">Crear primer modulo</button>
          </div>

          <table *ngIf="!isLoading && filteredModulos.length > 0" class="data-table">
            <thead>
              <tr>
                <th>Modulo</th>
                <th>Ruta</th>
                <th>Sección</th>
                <th>Orden</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let modulo of filteredModulos">
                <td>
                  <span class="modulo-icon">{{ modulo.icono || '📦' }}</span>
                  <strong>{{ modulo.nombre }}</strong>
                  <div class="modulo-desc" *ngIf="modulo.descripcion">{{ modulo.descripcion }}</div>
                </td>
                <td><code>{{ modulo.ruta }}</code></td>
                <td>{{ modulo.seccion || '—' }}</td>
                <td>{{ modulo.orden }}</td>
                <td>
                  <button
                    class="badge"
                    [class.badge-active]="modulo.activo"
                    [class.badge-inactive]="!modulo.activo"
                    (click)="toggleActivo(modulo)"
                    [title]="modulo.activo ? 'Desactivar' : 'Activar'"
                  >
                    {{ modulo.activo ? 'Activo' : 'Inactivo' }}
                  </button>
                </td>
                <td class="actions">
                  <button class="btn-icon btn-edit" [routerLink]="['/modulos/edit', modulo.id]" title="Editar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button class="btn-icon btn-danger" (click)="deleteModulo(modulo.id!)" title="Eliminar">
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
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1100px;
      margin: 0 auto;
    }

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

    .card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
    }

    .card-body {
      padding: 24px;
    }

    .filter-row {
      margin-bottom: 16px;

      .filter-input {
        width: 100%;
        max-width: 360px;
        padding: 10px 14px;
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 14px;
      }
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

      code {
        background: var(--bg-tertiary);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 13px;
      }

      .modulo-icon {
        font-size: 20px;
        margin-right: 8px;
      }

      .modulo-desc {
        font-size: 12px;
        color: var(--text-tertiary);
        font-weight: 400;
        margin-top: 2px;
      }

      .actions {
        white-space: nowrap;
      }
    }

    .badge {
      border: none;
      cursor: pointer;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge-active {
      background: var(--success-bg);
      color: var(--success-text);
      border: 1px solid var(--success-border);
    }

    .badge-inactive {
      background: var(--bg-tertiary);
      color: var(--text-tertiary);
      border: 1px solid var(--border-primary);
    }

    .btn-primary {
      background: var(--accent-primary);
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
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
      }
    }

    .btn-danger:hover {
      color: var(--danger-text);
    }
  `]
})
export class ModuloListComponent implements OnInit {
  modulos: Modulo[] = [];
  filteredModulos: Modulo[] = [];
  filter = '';
  isLoading = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private moduloService: ModuloService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.loadModulos();
  }

  loadModulos() {
    this.isLoading = true;
    this.moduloService.findAll().subscribe({
      next: (data) => {
        this.modulos = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los modulos.';
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    const term = this.filter.toLowerCase().trim();
    this.filteredModulos = term
      ? this.modulos.filter(m =>
          m.nombre.toLowerCase().includes(term) ||
          m.ruta.toLowerCase().includes(term)
        )
      : [...this.modulos];
  }

  toggleActivo(modulo: Modulo) {
    this.moduloService.update(modulo.id!, { activo: !modulo.activo }).subscribe({
      next: (updated) => {
        modulo.activo = updated.activo;
        this.showSuccess(`Modulo "${modulo.nombre}" ${updated.activo ? 'activado' : 'desactivado'}.`);
      },
      error: () => {
        this.showError('Error al cambiar el estado del modulo.');
      }
    });
  }

  deleteModulo(id: number) {
    this.confirmService.confirm({
      title: 'Eliminar modulo',
      message: '¿Esta seguro de eliminar este modulo? Desaparecera del menu.',
      confirmText: 'Si, eliminar',
      cancelText: 'Cancelar'
    }).subscribe(ok => {
      if (!ok) {
        return;
      }
      this.moduloService.delete(id).subscribe({
        next: () => {
          this.modulos = this.modulos.filter(m => m.id !== id);
          this.applyFilter();
          this.showSuccess('Modulo eliminado.');
        },
        error: (err) => {
          this.showError(err.error?.message || 'Error al eliminar el modulo.');
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
