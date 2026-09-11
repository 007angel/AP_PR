import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { IngresoService } from '../../../services/ingreso.service';
import { AuthService } from '../../../services/auth.service';
import { Ingreso } from '../../../models/ingreso.model';

@Component({
  selector: 'app-ingreso-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <a routerLink="/inventory/ingreso" class="back-link">← Volver a Ingresos</a>
          <h1>{{ isEditMode ? 'Editar Ingreso' : 'Nuevo Ingreso' }}</h1>
          <p>{{ isEditMode ? 'Actualizar datos del ingreso' : 'Registrar un nuevo ingreso al inventario' }}</p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/dashboard" class="btn-back">
            ← Dashboard
          </a>
        </div>
      </div>

      <div *ngIf="successMessage" class="success-message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        {{ successMessage }}
      </div>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-card">
        <form (ngSubmit)="onSubmit()">
          <div class="form-section">
            <h3>Datos del Ingreso</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="correlativo">Correlativo Ingreso *</label>
                <input
                  type="text"
                  id="correlativo"
                  name="correlativo"
                  [(ngModel)]="ingreso.correlativo"
                  placeholder="Ej: ING-00001"
                  required
                  readonly
                />
              </div>

              <div class="form-group">
                <label for="numeroFactura">Numero de Factura *</label>
                <input
                  type="text"
                  id="numeroFactura"
                  name="numeroFactura"
                  [(ngModel)]="ingreso.numeroFactura"
                  placeholder="Ej: FAC-2026-001"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="fechaIngreso">Fecha de Ingreso *</label>
                <input
                  type="datetime-local"
                  id="fechaIngreso"
                  name="fechaIngreso"
                  [(ngModel)]="ingreso.fechaIngreso"
                  required
                />
              </div>

              <div class="form-group">
                <label for="fechaDigitacion">Fecha de Digitacion *</label>
                <input
                  type="datetime-local"
                  id="fechaDigitacion"
                  name="fechaDigitacion"
                  [(ngModel)]="ingreso.fechaDigitacion"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cantidadTarimas">Cantidad de Tarimas *</label>
                <input
                  type="number"
                  id="cantidadTarimas"
                  name="cantidadTarimas"
                  [(ngModel)]="ingreso.cantidadTarimas"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div class="form-group">
                <label for="usuarioDigito">Usuario que Digito *</label>
                <input
                  type="text"
                  id="usuarioDigito"
                  name="usuarioDigito"
                  [(ngModel)]="ingreso.usuarioDigito"
                  placeholder="Nombre del usuario"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="proveedor">Proveedor</label>
                <input
                  type="text"
                  id="proveedor"
                  name="proveedor"
                  [(ngModel)]="ingreso.proveedor"
                  placeholder="Nombre del proveedor (opcional)"
                />
              </div>

              <div class="form-group">
                <label for="status">Estado</label>
                <select
                  id="status"
                  name="status"
                  [(ngModel)]="ingreso.status"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="valorTotal">Valor Total ($)</label>
                <input
                  type="number"
                  id="valorTotal"
                  name="valorTotal"
                  [(ngModel)]="ingreso.valorTotal"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div class="form-group">
                <label for="observaciones">Observaciones</label>
              </div>
            </div>

            <div class="form-group full-width">
              <label for="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                [(ngModel)]="ingreso.observaciones"
                placeholder="Observaciones adicionales (opcional)"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/inventory/ingreso" class="btn-cancel">Cancelar</a>
            <button type="submit" class="btn-save" [disabled]="isSaving">
              <span *ngIf="!isSaving">{{ isEditMode ? 'Actualizar' : 'Crear Ingreso' }}</span>
              <span *ngIf="isSaving">Guardando...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
    .back-link { display: inline-block; font-size: 13px; color: var(--text-tertiary); text-decoration: none; margin-bottom: 16px; transition: var(--transition); }
    .back-link:hover { color: var(--accent-primary); }
    .header-content h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
    .header-content p { font-size: 14px; color: var(--text-tertiary); margin: 0; }
    .header-actions { display: flex; gap: 12px; }
    .btn-back { padding: 12px 24px; font-size: 14px; font-weight: 600; color: var(--text-secondary); background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition); }
    .btn-back:hover { background: var(--bg-hover); color: var(--text-primary); border-color: var(--accent-primary); }
    
    .success-message {
      display: flex;
      align-items: center;
      gap: 10px;
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

    .form-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: 32px;
    }

    .form-section {
      margin-bottom: 32px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 20px 0;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border-primary);
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.full-width {
        grid-column: 1 / -1;
      }

      label {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-secondary);
      }

      input, select, textarea {
        padding: 12px 16px;
        font-size: 14px;
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        background: var(--bg-tertiary);
        color: var(--text-primary);
        transition: var(--transition);

        &:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-bg);
        }

        &:readonly {
          opacity: 0.7;
          cursor: not-allowed;
        }

        &::placeholder {
          color: var(--text-tertiary);
        }
      }

      textarea {
        resize: vertical;
        min-height: 80px;
      }

      select {
        cursor: pointer;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid var(--border-primary);
    }

    .btn-cancel {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: var(--transition);

      &:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
      }
    }

    .btn-save {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      background: var(--accent-primary);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition);

      &:hover:not(:disabled) {
        background: var(--accent-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class IngresoDetailComponent implements OnInit {
  isEditMode = false;
  ingresoId: string = '';
  
  ingreso: Ingreso = {
    correlativo: '',
    numeroFactura: '',
    fechaIngreso: new Date(),
    fechaDigitacion: new Date(),
    cantidadTarimas: 0,
    usuarioDigito: '',
    proveedor: '',
    observaciones: '',
    status: 'pendiente',
    valorTotal: 0
  };

  isSaving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private ingresoService: IngresoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.ingresoId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.ingresoId && this.ingresoId !== 'new') {
      this.isEditMode = true;
      this.loadIngreso();
    } else {
      this.initNewIngreso();
    }
  }

  initNewIngreso() {
    this.ingreso.fechaDigitacion = this.formatDateForInput(new Date());
    this.ingreso.usuarioDigito = this.authService.getUser()?.name || '';
    
    this.ingresoService.getCorrelativo(this.authService.getCompanyId() || 0).subscribe({
      next: (response) => {
        this.ingreso.correlativo = response.correlativo;
      },
      error: () => {
        this.ingreso.correlativo = 'ING-00001';
      }
    });
  }

  loadIngreso() {
    this.ingresoService.findOne(parseInt(this.ingresoId)).subscribe({
      next: (ingreso) => {
        this.ingreso = {
          ...ingreso,
          fechaIngreso: this.formatDateForInput(new Date(ingreso.fechaIngreso)),
          fechaDigitacion: this.formatDateForInput(new Date(ingreso.fechaDigitacion))
        };
      },
      error: () => {
        this.errorMessage = 'Error al cargar el ingreso';
      }
    });
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const ingresoData = {
      ...this.ingreso,
      fechaIngreso: new Date(this.ingreso.fechaIngreso),
      fechaDigitacion: new Date(this.ingreso.fechaDigitacion)
    };

    if (this.isEditMode) {
      this.ingresoService.update(parseInt(this.ingresoId), ingresoData).subscribe({
        next: () => {
          this.successMessage = 'Ingreso actualizado correctamente';
          this.isSaving = false;
          setTimeout(() => {
            this.router.navigate(['/inventory/ingreso']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al actualizar el ingreso';
          this.isSaving = false;
        }
      });
    } else {
      this.ingresoService.create(ingresoData).subscribe({
        next: () => {
          this.successMessage = 'Ingreso creado correctamente';
          this.isSaving = false;
          setTimeout(() => {
            this.router.navigate(['/inventory/ingreso']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al crear el ingreso';
          this.isSaving = false;
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.ingreso.correlativo) {
      this.errorMessage = 'El correlativo es requerido';
      return false;
    }
    if (!this.ingreso.numeroFactura) {
      this.errorMessage = 'El numero de factura es requerido';
      return false;
    }
    if (!this.ingreso.fechaIngreso) {
      this.errorMessage = 'La fecha de ingreso es requerida';
      return false;
    }
    if (!this.ingreso.fechaDigitacion) {
      this.errorMessage = 'La fecha de digitacion es requerida';
      return false;
    }
    if (this.ingreso.cantidadTarimas < 0) {
      this.errorMessage = 'La cantidad de tarimas debe ser mayor o igual a 0';
      return false;
    }
    if (!this.ingreso.usuarioDigito) {
      this.errorMessage = 'El usuario que digito es requerido';
      return false;
    }
    return true;
  }
}
