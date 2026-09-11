import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { IngresoDetalleService } from '../../../services/ingreso-detalle.service';
import { IngresoService } from '../../../services/ingreso.service';
import { IngresoDetalle } from '../../../models/ingreso-detalle.model';
import { Ingreso } from '../../../models/ingreso.model';

@Component({
  selector: 'app-ingreso-detalle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <div class="header-top">
            <a routerLink="/inventory/ingreso" class="back-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
              Volver
            </a>
            <h1>Detalle de Ingreso</h1>
          </div>
          <p *ngIf="ingreso" class="subtitle">
            {{ ingreso.correlativo }} - {{ ingreso.numeroFactura }}
          </p>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        Cargando...
      </div>

      <div *ngIf="!isLoading && error" class="error-state">
        <p>{{ error }}</p>
        <button (click)="loadData()" class="btn btn-primary">Reintentar</button>
      </div>

      <div *ngIf="!isLoading && !error">
        <div class="form-card">
          <div class="card-header">
            <h3>{{ editingId ? 'Editar Linea' : 'Agregar Linea' }}</h3>
          </div>
          <div class="card-body">
            <form (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <div class="form-group">
                  <label>Lote *</label>
                  <input type="text" [(ngModel)]="formData.lote" name="lote" required placeholder="Ej: LOTE-001">
                </div>

                <div class="form-group">
                  <label>Articulo *</label>
                  <input type="text" [(ngModel)]="formData.articulo" name="articulo" required placeholder="Nombre del articulo">
                </div>

                <div class="form-group">
                  <label>Tarima *</label>
                  <input type="number" [(ngModel)]="formData.tarima" name="tarima" required min="0">
                </div>

                <div class="form-group">
                  <label>Caja *</label>
                  <input type="number" [(ngModel)]="formData.caja" name="caja" required min="0">
                </div>

                <div class="form-group">
                  <label>Unidad *</label>
                  <input type="number" [(ngModel)]="formData.unidad" name="unidad" required min="0">
                </div>

                <div class="form-group">
                  <label>Total Ingreso *</label>
                  <input type="number" [(ngModel)]="formData.totalIngreso" name="totalIngreso" required min="0">
                </div>

                <div class="form-group">
                  <label>Solicitado *</label>
                  <input type="number" [(ngModel)]="formData.solicitado" name="solicitado" required min="0">
                </div>

                <div class="form-group">
                  <label>Entregado *</label>
                  <input type="number" [(ngModel)]="formData.entregado" name="entregado" required min="0">
                </div>

                <div class="form-group">
                  <label>Mermas *</label>
                  <input type="number" [(ngModel)]="formData.mermas" name="mermas" required min="0">
                </div>

                <div class="form-group">
                  <label>Devolucion *</label>
                  <input type="number" [(ngModel)]="formData.devolucion" name="devolucion" required min="0">
                </div>

                <div class="form-group">
                  <label>Costo Individual *</label>
                  <input type="number" [(ngModel)]="formData.costoIndividual" name="costoIndividual" required min="0" step="0.01">
                </div>
              </div>

              <div class="form-actions">
                <button type="button" (click)="cancelEdit()" class="btn btn-secondary" *ngIf="editingId">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving">
                  {{ isSaving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Agregar') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="table-card">
          <div class="card-header">
            <h3>Lineas del Ingreso ({{ detalles.length }})</h3>
          </div>
          <div class="card-body">
            <div *ngIf="detalles.length === 0" class="empty-state">
              <p>No hay lineas registradas</p>
            </div>

            <div *ngIf="detalles.length > 0" class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Lote</th>
                    <th>Articulo</th>
                    <th>Tarima</th>
                    <th>Caja</th>
                    <th>Unidad</th>
                    <th>Total</th>
                    <th>Solicitado</th>
                    <th>Entregado</th>
                    <th>Mermas</th>
                    <th>Devolucion</th>
                    <th>Costo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let detalle of detalles">
                    <td>{{ detalle.lote }}</td>
                    <td>{{ detalle.articulo }}</td>
                    <td>{{ detalle.tarima }}</td>
                    <td>{{ detalle.caja }}</td>
                    <td>{{ detalle.unidad }}</td>
                    <td>{{ detalle.totalIngreso }}</td>
                    <td>{{ detalle.solicitado }}</td>
                    <td>{{ detalle.entregado }}</td>
                    <td>{{ detalle.mermas }}</td>
                    <td>{{ detalle.devolucion }}</td>
                    <td>{{ detalle.costoIndividual | number:'1.2-2' }}</td>
                    <td class="actions-cell">
                      <button (click)="editDetalle(detalle)" class="btn-icon" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button (click)="deleteDetalle(detalle.id!)" class="btn-icon btn-danger" title="Eliminar">
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
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 32px;
    }

    .page-header {
      margin-bottom: 32px;

      .header-top {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 8px;
      }

      .back-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 14px;
        padding: 8px 12px;
        border-radius: var(--radius-md);
        transition: var(--transition);

        &:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
      }

      h1 {
        font-size: 28px;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
      }

      .subtitle {
        font-size: 14px;
        color: var(--text-tertiary);
        margin: 0;
      }
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: var(--text-tertiary);

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--border-primary);
        border-top-color: var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-state {
      text-align: center;
      padding: 40px;
      background: var(--danger-bg);
      border-radius: var(--radius-lg);
      color: var(--danger-text);

      p {
        margin: 0 0 16px 0;
      }
    }

    .form-card, .table-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 24px;
    }

    .card-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-primary);

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }
    }

    .card-body {
      padding: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
      }

      input {
        padding: 10px 14px;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: 14px;
        transition: var(--transition);

        &:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-bg);
        }

        &::placeholder {
          color: var(--text-tertiary);
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
      border: none;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: var(--accent-primary);
      color: white;

      &:hover:not(:disabled) {
        background: var(--accent-secondary);
      }
    }

    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border: 1px solid var(--border-primary);

      &:hover:not(:disabled) {
        background: var(--border-primary);
      }
    }

    .btn-icon {
      padding: 8px;
      background: transparent;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition);
      color: var(--text-secondary);

      &:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }

      &.btn-danger:hover {
        background: var(--danger-bg);
        color: var(--danger-text);
      }
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: var(--text-tertiary);

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid var(--border-primary);
      }

      th {
        font-size: 12px;
        font-weight: 600;
        color: var(--text-tertiary);
        text-transform: uppercase;
        background: var(--bg-tertiary);
      }

      td {
        font-size: 14px;
        color: var(--text-primary);
      }

      tbody tr:hover {
        background: var(--bg-tertiary);
      }
    }

    .actions-cell {
      display: flex;
      gap: 4px;
    }
  `]
})
export class IngresoDetalleFormComponent implements OnInit {
  ingresoId: number = 0;
  ingreso: Ingreso | null = null;
  detalles: IngresoDetalle[] = [];
  
  formData: IngresoDetalle = this.getEmptyForm();
  editingId: number | null = null;
  
  isLoading = true;
  isSaving = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingresoDetalleService: IngresoDetalleService,
    private ingresoService: IngresoService
  ) {}

  ngOnInit() {
    this.ingresoId = parseInt(this.route.snapshot.params['ingresoId'] || '0');
    if (this.ingresoId) {
      this.loadData();
    } else {
      this.error = 'ID de ingreso no valido';
      this.isLoading = false;
    }
  }

  loadData() {
    this.isLoading = true;
    this.error = null;

    this.ingresoService.findOne(this.ingresoId).subscribe({
      next: (ingreso) => {
        this.ingreso = ingreso;
        this.loadDetalles();
      },
      error: () => {
        this.error = 'Error al cargar el ingreso';
        this.isLoading = false;
      }
    });
  }

  loadDetalles() {
    this.ingresoDetalleService.findByIngreso(this.ingresoId).subscribe({
      next: (detalles) => {
        this.detalles = detalles;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al cargar los detalles';
        this.isLoading = false;
      }
    });
  }

  getEmptyForm(): IngresoDetalle {
    return {
      ingreso_id: this.ingresoId,
      lote: '',
      articulo: '',
      tarima: 0,
      caja: 0,
      unidad: 0,
      totalIngreso: 0,
      solicitado: 0,
      entregado: 0,
      mermas: 0,
      devolucion: 0,
      costoIndividual: 0
    };
  }

  onSubmit() {
    this.isSaving = true;

    if (this.editingId) {
      this.ingresoDetalleService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.loadDetalles();
          this.resetForm();
          this.isSaving = false;
        },
        error: () => {
          this.isSaving = false;
        }
      });
    } else {
      this.ingresoDetalleService.create(this.formData).subscribe({
        next: () => {
          this.loadDetalles();
          this.resetForm();
          this.isSaving = false;
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }

  editDetalle(detalle: IngresoDetalle) {
    this.editingId = detalle.id!;
    this.formData = { ...detalle };
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.editingId = null;
    this.formData = this.getEmptyForm();
  }

  deleteDetalle(id: number) {
    if (confirm('Esta seguro de eliminar esta linea?')) {
      this.ingresoDetalleService.delete(id).subscribe({
        next: () => {
          this.loadDetalles();
        },
        error: () => {
        }
      });
    }
  }
}
