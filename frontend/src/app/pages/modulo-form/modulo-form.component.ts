import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ModuloService } from '../../services/modulo.service';
import { Modulo } from '../../models/modulo.model';

@Component({
  selector: 'app-modulo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>{{ isEditMode ? 'Editar Modulo' : 'Nuevo Modulo' }}</h1>
          <p>{{ isEditMode ? 'Actualizar los datos del modulo' : 'Registrar un nuevo modulo del menu' }}</p>
        </div>
        <div class="header-actions">
          <a routerLink="/modulos" class="back-link">← Volver a modulos</a>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="card" *ngIf="!isLoading">
        <div class="card-body">
          <form (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <div class="form-group">
                <label for="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  [(ngModel)]="modulo.nombre"
                  placeholder="Ej: Kardex"
                  maxlength="100"
                />
                <span class="field-error" *ngIf="formErrors['nombre']">{{ formErrors['nombre'] }}</span>
              </div>

              <div class="form-group">
                <label for="ruta">Ruta *</label>
                <input
                  type="text"
                  id="ruta"
                  name="ruta"
                  [(ngModel)]="modulo.ruta"
                  placeholder="Ej: /inventory/reportes/kardex"
                  maxlength="200"
                />
                <span class="field-hint">Debe iniciar con /</span>
                <span class="field-error" *ngIf="formErrors['ruta']">{{ formErrors['ruta'] }}</span>
              </div>

              <div class="form-group">
                <label for="icono">Icono</label>
                <select id="icono" name="icono" [(ngModel)]="modulo.icono">
                  <option *ngFor="let icon of iconos" [value]="icon.value">
                    {{ icon.value }} {{ icon.label }}
                  </option>
                </select>
                <div class="icono-preview">Vista previa: <span>{{ modulo.icono }}</span></div>
              </div>

              <div class="form-group">
                <label for="seccion">Sección</label>
                <input
                  type="text"
                  id="seccion"
                  name="seccion"
                  [(ngModel)]="modulo.seccion"
                  placeholder="Ej: Ingresos (vacío = sin sección)"
                  maxlength="50"
                />
              </div>

              <div class="form-group">
                <label for="orden">Orden</label>
                <input
                  type="number"
                  id="orden"
                  name="orden"
                  [(ngModel)]="modulo.orden"
                  min="0"
                />
              </div>

              <div class="form-group form-check">
                <label>
                  <input type="checkbox" name="activo" [(ngModel)]="modulo.activo" />
                  Modulo activo (visible en el menu)
                </label>
              </div>

              <div class="form-group form-full">
                <label for="descripcion">Descripcion</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  [(ngModel)]="modulo.descripcion"
                  rows="3"
                  maxlength="500"
                  placeholder="Descripcion opcional del modulo"
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" routerLink="/modulos">Cancelar</button>
              <button type="submit" class="btn-primary" [disabled]="isSaving">
                {{ isSaving ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading">Cargando...</div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 900px;
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

      input[type="text"],
      input[type="number"],
      select,
      textarea {
        padding: 10px 14px;
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 14px;
        font-family: inherit;
      }

      .field-hint {
        font-size: 12px;
        color: var(--text-tertiary);
      }

      .field-error {
        font-size: 12px;
        color: var(--danger-text);
      }

      .icono-preview {
        font-size: 13px;
        color: var(--text-tertiary);

        span {
          font-size: 22px;
        }
      }
    }

    .form-full {
      grid-column: 1 / -1;
    }

    .form-check {
      justify-content: flex-end;

      label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid var(--border-primary);
      color: var(--text-secondary);
      padding: 10px 18px;
      border-radius: var(--radius-md);
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
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

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--text-tertiary);
    }
  `]
})
export class ModuloFormComponent implements OnInit {
  modulo: Modulo = this.getEmptyForm();
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  formErrors: { [key: string]: string } = {};

  iconos = [
    { value: '📦', label: 'Paquete' },
    { value: '📊', label: 'Grafico' },
    { value: '📋', label: 'Lista' },
    { value: '📈', label: 'Tendencia' },
    { value: '🗂️', label: 'Archivo' },
    { value: '⚙️', label: 'Ajustes' },
    { value: '📁', label: 'Carpeta' },
    { value: '🧾', label: 'Recibo' },
    { value: '🏷️', label: 'Etiqueta' },
    { value: '🚚', label: 'Camion' },
    { value: '📝', label: 'Nota' },
    { value: '🔔', label: 'Alerta' },
    { value: '📅', label: 'Calendario' },
    { value: '💰', label: 'Dinero' },
    { value: '🧮', label: 'Calculo' },
    { value: '👥', label: 'Usuarios' }
  ];

  constructor(
    private moduloService: ModuloService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadModulo(Number(id));
    }
  }

  getEmptyForm(): Modulo {
    return {
      nombre: '',
      ruta: '',
      icono: '📦',
      orden: 0,
      seccion: '',
      activo: true,
      descripcion: ''
    };
  }

  loadModulo(id: number) {
    this.isLoading = true;
    this.moduloService.findOne(id).subscribe({
      next: (data) => {
        this.modulo = { ...data, icono: data.icono || '📦', seccion: data.seccion || '' };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar el modulo.';
        this.isLoading = false;
      }
    });
  }

  validate(): boolean {
    this.formErrors = {};
    if (!this.modulo.nombre || this.modulo.nombre.trim().length < 2) {
      this.formErrors['nombre'] = 'El nombre debe tener al menos 2 caracteres';
    }
    if (!this.modulo.ruta || !this.modulo.ruta.startsWith('/')) {
      this.formErrors['ruta'] = 'La ruta debe iniciar con / (Ej: /inventory/kardex)';
    }
    return Object.keys(this.formErrors).length === 0;
  }

  onSubmit() {
    if (!this.validate()) {
      return;
    }
    this.isSaving = true;
    this.errorMessage = null;
    const payload: Modulo = {
      ...this.modulo,
      nombre: this.modulo.nombre.trim(),
      ruta: this.modulo.ruta.trim()
    };

    const request = this.isEditMode
      ? this.moduloService.update(this.modulo.id!, payload)
      : this.moduloService.create(payload);

    request.subscribe({
      next: () => {
        this.router.navigate(['/modulos']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar el modulo.';
        this.isSaving = false;
      }
    });
  }
}
