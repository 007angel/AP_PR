import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { IngresoDetalleService } from '../../../services/ingreso-detalle.service';
import { SolicitudService } from '../../../services/solicitud.service';
import { ArticuloService } from '../../../services/articulo.service';
import { IngresoService } from '../../../services/ingreso.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../../../shared/confirm-dialog/confirm.service';
import { IngresoDetalle } from '../../../models/ingreso-detalle.model';
import { Ingreso } from '../../../models/ingreso.model';
import { Solicitud } from '../../../models/solicitud.model';
import { Articulo } from '../../../models/articulo.model';

@Component({
  selector: 'app-ingreso-detalle-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <app-confirm-dialog></app-confirm-dialog>
      <div class="page-header">
        <div class="header-content">
          <h1>Detalle de Ingreso</h1>
          <p *ngIf="ingreso" class="subtitle">
            {{ ingreso.correlativo }} - {{ ingreso.numeroFactura }} | Valor Total: {{ ingreso.valorTotal | number:'1.2-2' }} | Estado: <strong [class.status-complete]="ingreso.status === 'completado'">{{ ingreso.status }}</strong>
          </p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/ingreso" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Volver
          </a>
        </div>
      </div>

      <div *ngIf="ingreso" class="tarimas-bar">
        <div class="tarimas-info">
          <span class="tarimas-total">Tarimas totales: <strong>{{ ingreso.cantidadTarimas }}</strong></span>
          <span class="separator">|</span>
          <span class="tarimas-used">Usadas: <strong>{{ tarimasUsadas }}</strong></span>
          <span class="separator">|</span>
          <span class="tarimas-available" [class.full]="tarimasDisponibles <= 0">
            Disponibles: <strong>{{ tarimasDisponibles }}</strong>
          </span>
        </div>
        <div class="tarimas-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="porcentajeUsado"></div>
          </div>
          <span class="progress-text">{{ porcentajeUsado | number:'1.0-0' }}%</span>
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
        <div *ngIf="noticeMessage" class="notice-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ noticeMessage }}
        </div>

        <div *ngIf="ingresoCompleto" class="complete-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Ingreso completo: todas las tarimas fueron asignadas. No se permiten agregar, modificar ni eliminar lineas.
        </div>

        <div class="form-card" *ngIf="!ingresoCompleto">
          <div class="card-header">
            <h3>{{ editingId ? 'Editar Linea' : 'Agregar Linea' }}</h3>
          </div>
          <div class="card-body">
            <form (ngSubmit)="onSubmit()">
              <div class="foto-section">
                <div class="foto-preview">
                  <img [src]="formData.foto || fotoPlaceholder" alt="Foto del articulo">
                </div>
                <div class="foto-info">
                  <label>Foto del Articulo</label>
                  <p class="foto-hint">{{ formData.foto ? 'Foto cargada por el usuario' : 'Sin foto: se muestra imagen recomendada' }}</p>
                  <div class="foto-actions">
                    <input type="file" #fotoInput accept="image/*" (change)="onFotoSelected($event)" hidden>
                    <button type="button" (click)="fotoInput.click()" class="btn btn-secondary btn-sm">
                      {{ formData.foto ? 'Cambiar foto' : 'Cargar foto' }}
                    </button>
                    <button type="button" (click)="removeFoto()" class="btn btn-secondary btn-sm" *ngIf="formData.foto">
                      Quitar
                    </button>
                  </div>
                  <span class="field-error" *ngIf="formErrors['foto']">{{ formErrors['foto'] }}</span>
                </div>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Lote *</label>
                  <input type="text" [(ngModel)]="formData.lote" name="lote" required placeholder="Ej: LOTE-001">
                  <span class="field-error" *ngIf="formErrors['lote']">{{ formErrors['lote'] }}</span>
                </div>

                <div class="form-group">
                  <label>Articulo *</label>
                  <div class="articulo-autocomplete">
                    <input
                      type="text"
                      [(ngModel)]="articuloSearch"
                      name="articuloSearch"
                      placeholder="Buscar artículo..."
                      class="form-input"
                      (input)="onArticuloSearch()"
                      (focus)="showArticuloDropdown = true"
                      (blur)="hideArticuloDropdown()"
                    />
                    <div class="articulo-dropdown" *ngIf="showArticuloDropdown && articulosFiltered.length > 0">
                      <div
                        *ngFor="let a of articulosFiltered"
                        class="articulo-option"
                        (mousedown)="selectArticulo(a)"
                      >
                        <div class="option-foto" *ngIf="a.foto">
                          <img [src]="a.foto" [alt]="a.nombre" />
                        </div>
                        <div class="option-foto option-placeholder" *ngIf="!a.foto">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                        <div class="option-info">
                          <span class="option-nombre">{{ a.nombre }}</span>
                          <span class="option-meta" *ngIf="a.codigo">{{ a.codigo }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span class="field-error" *ngIf="formErrors['articulo']">{{ formErrors['articulo'] }}</span>
                </div>

                <div class="form-group">
                  <label>Tarima * (disponibles: {{ tarimasDisponibles }})</label>
                  <input type="number" [(ngModel)]="formData.tarima" name="tarima" required min="1" [max]="tarimasDisponibles" (ngModelChange)="calcularTotalIngreso()">
                  <span class="field-error" *ngIf="formErrors['tarima']">{{ formErrors['tarima'] }}</span>
                </div>

                <div class="form-group">
                  <label>Caja (Bulto) *</label>
                  <input type="number" [(ngModel)]="formData.caja" name="caja" required min="1" (ngModelChange)="calcularTotalIngreso()">
                  <span class="field-error" *ngIf="formErrors['caja']">{{ formErrors['caja'] }}</span>
                </div>

                <div class="form-group">
                  <label>Total Ingreso (= Tarima * Caja)</label>
                  <input type="number" [(ngModel)]="formData.totalIngreso" name="totalIngreso" readonly>
                </div>

                <div class="form-group">
                  <label>Solicitado</label>
                  <input type="number" [(ngModel)]="formData.solicitado" name="solicitado" min="0" readonly>
                </div>

                <div class="form-group">
                  <label>Entregado</label>
                  <input type="number" [(ngModel)]="formData.entregado" name="entregado" min="0" readonly>
                </div>

                <div class="form-group">
                  <label>Mermas</label>
                  <input type="number" [(ngModel)]="formData.mermas" name="mermas" min="0" readonly>
                </div>

                <div class="form-group">
                  <label>Devolucion</label>
                  <input type="number" [(ngModel)]="formData.devolucion" name="devolucion" min="0" readonly>
                </div>

                <div class="form-group">
                  <label>Costo Individual (= Total / Valor Total)</label>
                  <input type="number" [(ngModel)]="formData.costoIndividual" name="costoIndividual" readonly step="0.01">
                </div>
              </div>

              <div class="form-actions">
                <button type="button" (click)="cancelEdit()" class="btn btn-secondary" *ngIf="editingId">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving || tarimasDisponibles <= 0 && !editingId">
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
                    <th>Foto</th>
                    <th>Lote</th>
                    <th>Articulo</th>
                    <th>Tarima</th>
                    <th>Caja</th>
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
                    <td><img [src]="detalle.foto || fotoPlaceholder" alt="Foto" class="thumb"></td>
                    <td>{{ detalle.lote }}</td>
                    <td>{{ detalle.articulo }}</td>
                    <td>{{ detalle.tarima }}</td>
                    <td>{{ detalle.caja }}</td>
                    <td>{{ detalle.totalIngreso }}</td>
                    <td>{{ detalle.solicitado }}</td>
                    <td>{{ detalle.entregado }}</td>
                    <td>{{ detalle.mermas }}</td>
                    <td>{{ detalle.devolucion }}</td>
                    <td>{{ detalle.costoIndividual | number:'1.2-2' }}</td>
                    <td class="actions-cell">
                      <span *ngIf="ingresoCompleto" class="locked-label" title="Ingreso completo">Bloqueado</span>
                      <button *ngIf="!ingresoCompleto" (click)="editDetalle(detalle)" class="btn-icon" title="Editar">
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

          <!-- Solicitudes Vinculadas -->
          <div class="card solicitudes-section" *ngIf="solicitudesVinculadas.length > 0">
            <div class="card-header">
              <h3>Solicitudes Vinculadas ({{ solicitudesVinculadas.length }})</h3>
            </div>
            <div class="card-body">
              <div *ngFor="let sol of solicitudesVinculadas" class="solicitud-card">
                <div class="solicitud-header">
                  <div class="solicitud-info">
                    <strong>{{ sol.correlativo }}</strong>
                    <span class="solicitud-date">{{ sol.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
                  </div>
                  <div class="solicitud-meta">
                    <span class="solicitud-cliente" *ngIf="sol.cliente">{{ sol.cliente.nombre }}</span>
                    <span class="status-badge" [class]="'status-' + sol.estado">{{ getEstadoLabel(sol.estado) }}</span>
                  </div>
                </div>
                <div class="solicitud-detalles">
                  <div *ngFor="let det of sol.detalles" class="detalle-row">
                    <div class="detalle-info">
                      <span class="detalle-articulo">{{ det.articulo }}</span>
                      <span class="detalle-meta">Lote: {{ det.lote || '—' }}</span>
                    </div>
                    <div class="detalle-cantidades">
                      <span class="cantidad-label">Solicitado:</span>
                      <span class="cantidad-value">{{ det.cantidadSolicitada }}</span>
                    </div>
                    <div class="detalle-entrega">
                      <span class="cantidad-label">Entregado:</span>
                      <input
                        type="number"
                        [(ngModel)]="det.cantidadEntregada"
                        [max]="det.cantidadSolicitada"
                        min="0"
                        class="qty-input-sm"
                        (change)="updateEntrega(det)"
                      />
                    </div>
                    <div class="detalle-porcentaje">
                      <div class="mini-progress">
                        <div class="mini-fill" [style.width.%]="getPorcentajeEntrega(det)"></div>
                      </div>
                      <span class="porcentaje-text">{{ getPorcentajeEntrega(det) | number:'1.0-0' }}%</span>
                    </div>
                  </div>
                </div>
              </div>
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
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;

      .header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
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

    .tarimas-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      margin-bottom: 24px;
    }

    .tarimas-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--text-secondary);

      .separator {
        color: var(--border-primary);
      }

      strong {
        color: var(--text-primary);
        font-weight: 600;
      }

      .tarimas-available {
        color: var(--accent-primary);

        &.full {
          color: var(--danger-text);
        }
      }
    }

    .tarimas-progress {
      display: flex;
      align-items: center;
      gap: 10px;

      .progress-bar {
        width: 150px;
        height: 8px;
        background: var(--bg-tertiary);
        border-radius: 4px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          background: var(--accent-primary);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      }

      .progress-text {
        font-size: 12px;
        color: var(--text-tertiary);
        min-width: 35px;
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

    .foto-section {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      margin-bottom: 24px;
      padding: 16px;
      background: var(--bg-tertiary);
      border: 1px dashed var(--border-primary);
      border-radius: var(--radius-md);
    }

    .foto-preview {
      flex-shrink: 0;

      img {
        width: 160px;
        height: 120px;
        object-fit: cover;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-primary);
        background: var(--bg-secondary);
      }
    }

    .foto-info {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
      }

      .foto-hint {
        font-size: 12px;
        color: var(--text-tertiary);
        margin: 0;
      }

      .foto-actions {
        display: flex;
        gap: 8px;
      }

      .btn-sm {
        padding: 8px 14px;
        font-size: 13px;
      }
    }

    .thumb {
      width: 48px;
      height: 36px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid var(--border-primary);
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

        &[readonly] {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: not-allowed;
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

    .field-error {
      color: var(--danger-text);
      font-size: 12px;
      margin-top: 4px;
    }

    .notice-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: var(--warning-bg, #fff8e1);
      border: 1px solid var(--warning-border, #f0d48a);
      border-radius: var(--radius-lg);
      margin-bottom: 24px;
      color: var(--warning-text, #8a6d00);
      font-size: 14px;
      font-weight: 500;
    }

    .complete-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: var(--success-bg, #e6f4ea);
      border: 1px solid var(--success-border, #a3d9b1);
      border-radius: var(--radius-lg);
      margin-bottom: 24px;
      color: var(--success-text, #1a7f37);
      font-size: 14px;
      font-weight: 500;
    }

    .status-complete {
      color: var(--success-text, #1a7f37);
      text-transform: uppercase;
    }

    .locked-label {
      font-size: 12px;
      color: var(--text-tertiary);
      font-style: italic;
      padding: 8px 4px;
    }

    /* Articulo Autocomplete */
    .articulo-autocomplete { position: relative; }
    .articulo-dropdown { position: absolute; top: 100%; left: 0; right: 0; z-index: 200; background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: 0 0 var(--radius-md) var(--radius-md); max-height: 240px; overflow-y: auto; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .articulo-option { display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer; transition: background 0.15s; }
    .articulo-option:hover { background: var(--bg-tertiary); }
    .option-foto { width: 36px; height: 36px; border-radius: 6px; overflow: hidden; flex-shrink: 0; background: var(--bg-tertiary); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
    .option-foto img { width: 100%; height: 100%; object-fit: cover; }
    .option-info { display: flex; flex-direction: column; min-width: 0; }
    .option-nombre { font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .option-meta { font-size: 11px; color: var(--text-muted); }

    /* Solicitudes Vinculadas */
    .solicitudes-section { margin-top: 24px; }
    .solicitudes-section .card-header { padding: 16px 20px; border-bottom: 1px solid var(--border-primary); }
    .solicitudes-section .card-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: var(--text-primary); }
    .solicitudes-section .card-body { padding: 16px 20px; }
    .solicitud-card { border: 1px solid var(--border-primary); border-radius: var(--radius-md); margin-bottom: 14px; overflow: hidden; }
    .solicitud-card:last-child { margin-bottom: 0; }
    .solicitud-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-primary); }
    .solicitud-info { display: flex; align-items: center; gap: 10px; }
    .solicitud-info strong { font-size: 14px; color: var(--accent-primary); }
    .solicitud-date { font-size: 12px; color: var(--text-muted); }
    .solicitud-meta { display: flex; align-items: center; gap: 10px; }
    .solicitud-cliente { font-size: 13px; color: var(--text-secondary); }
    .status-badge { padding: 3px 10px; border-radius: 16px; font-size: 11px; font-weight: 600; }
    .status-pendiente { background: var(--warning-bg); color: var(--warning-text); }
    .status-aprobado { background: var(--success-bg); color: var(--success-text); }
    .status-completado { background: #ede9fe; color: #7c3aed; }
    .status-rechazado { background: var(--danger-bg); color: var(--danger-text); }
    .solicitud-detalles { padding: 12px 16px; }
    .detalle-row { display: flex; align-items: center; gap: 16px; padding: 10px 0; border-bottom: 1px solid var(--border-primary); }
    .detalle-row:last-child { border-bottom: none; }
    .detalle-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .detalle-articulo { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .detalle-meta { font-size: 12px; color: var(--text-muted); }
    .detalle-cantidades, .detalle-entrega { display: flex; align-items: center; gap: 6px; }
    .cantidad-label { font-size: 12px; color: var(--text-muted); white-space: nowrap; }
    .cantidad-value { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .qty-input-sm { width: 60px; padding: 5px 8px; font-size: 13px; font-weight: 600; text-align: center; border: 1px solid var(--border-primary); border-radius: 6px; background: var(--bg-primary); color: var(--text-primary); outline: none; }
    .qty-input-sm:focus { border-color: var(--accent-primary); }
    .detalle-porcentaje { display: flex; align-items: center; gap: 6px; min-width: 80px; }
    .mini-progress { width: 40px; height: 5px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
    .mini-fill { height: 100%; background: var(--success); border-radius: 3px; transition: width 0.3s; }
    .porcentaje-text { font-size: 11px; color: var(--text-muted); min-width: 30px; }
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

  solicitudesVinculadas: Solicitud[] = [];
  private solicitudTimeout: any = null;

  articulosCatalogo: Articulo[] = [];
  articulosFiltered: Articulo[] = [];
  articuloSearch = '';
  showArticuloDropdown = false;

  formErrors: { [key: string]: string } = {};
  fotoPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120'%3E%3Crect width='160' height='120' fill='%23343a40'/%3E%3Ccircle cx='80' cy='48' r='16' fill='none' stroke='%23adb5bd' stroke-width='3'/%3E%3Cpath d='M40 108 L64 76 L88 100 L100 88 L122 108 Z' fill='none' stroke='%23adb5bd' stroke-width='3'/%3E%3C/svg%3E";
  noticeMessage: string | null = null;
  private noticeTimeout: any = null;

  showNotice(message: string) {
    this.noticeMessage = message;
    if (this.noticeTimeout) {
      clearTimeout(this.noticeTimeout);
    }
    this.noticeTimeout = setTimeout(() => {
      this.noticeMessage = null;
    }, 5000);
  }

  get tarimasUsadas(): number {
    let sum = 0;
    for (const d of this.detalles) {
      if (this.editingId && d.id === this.editingId) {
        continue;
      }
      sum += d.tarima || 0;
    }
    return sum;
  }

  get tarimasDisponibles(): number {
    const total = this.ingreso?.cantidadTarimas || 0;
    return total - this.tarimasUsadas;
  }

  get porcentajeUsado(): number {
    const total = this.ingreso?.cantidadTarimas || 0;
    if (total <= 0) return 0;
    return (this.tarimasUsadas / total) * 100;
  }

  get ingresoCompleto(): boolean {
    const total = this.ingreso?.cantidadTarimas || 0;
    return !!this.ingreso && total > 0 && this.tarimasDisponibles <= 0 && this.detalles.length > 0;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingresoDetalleService: IngresoDetalleService,
    private solicitudService: SolicitudService,
    private articuloService: ArticuloService,
    private ingresoService: IngresoService,
    private authService: AuthService,
    private confirmService: ConfirmService
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

    const companyId = this.authService.getCompanyId();
    this.articuloService.findAll(companyId).subscribe({
      next: (arts) => { this.articulosCatalogo = arts; },
      error: () => {}
    });

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
        this.loadSolicitudes();
      },
      error: () => {
        this.error = 'Error al cargar los detalles';
        this.isLoading = false;
      }
    });
  }

  loadSolicitudes() {
    this.solicitudService.findByIngreso(this.ingresoId).subscribe({
      next: (solicitudes) => {
        this.solicitudesVinculadas = solicitudes;
        this.isLoading = false;
      },
      error: () => {
        this.solicitudesVinculadas = [];
        this.isLoading = false;
      }
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: any = { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado', completado: 'Completado' };
    return labels[estado] || estado;
  }

  getPorcentajeEntrega(det: any): number {
    if (!det.cantidadSolicitada || det.cantidadSolicitada === 0) return 0;
    return Math.min(100, ((det.cantidadEntregada || 0) / det.cantidadSolicitada) * 100);
  }

  updateEntrega(det: any) {
    if (det.cantidadEntregada < 0) det.cantidadEntregada = 0;
    if (det.cantidadEntregada > det.cantidadSolicitada) {
      det.cantidadEntregada = det.cantidadSolicitada;
    }

    if (this.solicitudTimeout) clearTimeout(this.solicitudTimeout);
    this.solicitudTimeout = setTimeout(() => {
      this.solicitudService.updateDetalle(det.id, det.cantidadEntregada).subscribe({
        next: () => {
          this.showNotice('Cantidad entregada actualizada');
          this.loadSolicitudes();
        },
        error: (err) => {
          this.showNotice(err.error?.message || 'Error al actualizar');
          this.loadSolicitudes();
        }
      });
    }, 500);
  }

  onArticuloSearch() {
    this.formData.articulo = this.articuloSearch;
    this.formData.articuloId = null;
    const term = this.articuloSearch.toLowerCase().trim();
    if (!term) {
      this.articulosFiltered = this.articulosCatalogo.slice(0, 20);
      return;
    }
    this.articulosFiltered = this.articulosCatalogo.filter(a =>
      (a.nombre && a.nombre.toLowerCase().includes(term)) ||
      (a.codigo && a.codigo.toLowerCase().includes(term))
    ).slice(0, 20);
  }

  selectArticulo(articulo: Articulo) {
    this.formData.articulo = articulo.nombre;
    this.formData.articuloId = articulo.id!;
    if (articulo.foto && !this.formData.foto) {
      this.formData.foto = articulo.foto;
    }
    this.articuloSearch = articulo.nombre;
    this.showArticuloDropdown = false;
  }

  hideArticuloDropdown() {
    setTimeout(() => { this.showArticuloDropdown = false; }, 200);
  }

  getEmptyForm(): IngresoDetalle {
    return {
      ingreso_id: 0,
      lote: '',
      articulo: '',
      articuloId: null,
      tarima: 1,
      caja: 1,
      unidad: 1,
      totalIngreso: 0,
      solicitado: 0,
      entregado: 0,
      mermas: 0,
      devolucion: 0,
      costoIndividual: 0,
      foto: ''
    };
  }

  onFotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    input.value = '';
    if (!file) {
      return;
    }
    delete this.formErrors['foto'];
    if (!file.type.startsWith('image/')) {
      this.formErrors['foto'] = 'El archivo debe ser una imagen';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.formErrors['foto'] = 'La foto no debe superar 2 MB';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.formData.foto = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeFoto() {
    this.formData.foto = '';
  }

  onSubmit() {
    this.formErrors = {};
    if (this.ingresoCompleto && !this.editingId) {
      this.formErrors['tarima'] = 'El ingreso esta completo, no se permiten mas lineas';
      return;
    }
    this.calcularTotalIngreso();
    if (!this.validateForm()) {
      return;
    }

    this.formData.ingreso_id = this.ingresoId;
    this.formData.companyId = this.ingreso?.companyId ?? this.authService.getCompanyId();
    this.formData.userId = this.authService.getUser()?.id || null;
    this.isSaving = true;

    if (this.editingId) {
      this.ingresoDetalleService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.loadData();
          this.resetForm();
          this.isSaving = false;
        },
        error: () => {
          this.loadData();
          this.isSaving = false;
        }
      });
    } else {
      this.ingresoDetalleService.create(this.formData).subscribe({
        next: () => {
          this.loadData();
          this.resetForm();
          this.isSaving = false;
        },
        error: () => {
          this.loadData();
          this.isSaving = false;
        }
      });
    }
  }

  editDetalle(detalle: IngresoDetalle) {
    if (this.ingresoCompleto) {
      return;
    }
    this.editingId = detalle.id!;
    this.formData = { ...detalle };
    this.articuloSearch = detalle.articulo || '';
    this.calcularTotalIngreso();
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.editingId = null;
    this.formData = this.getEmptyForm();
    this.articuloSearch = '';
    this.calcularTotalIngreso();
  }

  deleteDetalle(id: number) {
    if (this.ingresoCompleto) {
      this.showNotice('El estado completado no permite la eliminacion, contacte a su supervisor.');
      return;
    }
    this.confirmService.confirm({
      title: 'Eliminar linea',
      message: '¿Esta seguro de eliminar esta linea del detalle?',
      confirmText: 'Si, eliminar',
      cancelText: 'Cancelar'
    }).subscribe(ok => {
      if (!ok) {
        return;
      }
      this.ingresoDetalleService.delete(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          this.showNotice(err.error?.message || 'Error al eliminar la linea.');
          this.loadData();
        }
      });
    });
  }

  calcularTotalIngreso() {
    this.formData.totalIngreso = (this.formData.tarima || 0) * (this.formData.caja || 0);
    this.calcularCostoIndividual();
  }

  calcularCostoIndividual() {
    if (this.ingreso && this.ingreso.valorTotal && this.ingreso.valorTotal > 0 && this.formData.totalIngreso) {
      this.formData.costoIndividual = this.formData.totalIngreso / this.ingreso.valorTotal;
    } else {
      this.formData.costoIndividual = 0;
    }
  }

  validateForm(): boolean {
    let valid = true;

    if (!this.formData.lote) {
      this.formErrors['lote'] = 'El lote es requerido';
      valid = false;
    }
    if (!this.formData.articulo) {
      this.formErrors['articulo'] = 'El articulo es requerido';
      valid = false;
    }
    if (!this.formData.tarima || this.formData.tarima <= 0) {
      this.formErrors['tarima'] = 'La tarima debe ser mayor a 0';
      valid = false;
    } else if (this.formData.tarima > this.tarimasDisponibles) {
      this.formErrors['tarima'] = `No hay suficientes tarimas. Disponibles: ${this.tarimasDisponibles}`;
      valid = false;
    }
    if (!this.formData.caja || this.formData.caja <= 0) {
      this.formErrors['caja'] = 'La caja (bulto) es requerida y debe ser mayor a 0';
      valid = false;
    }
    if (this.formData.totalIngreso <= 0) {
      this.formErrors['totalIngreso'] = 'El total ingreso debe ser mayor a 0 (verifique tarima y caja)';
      valid = false;
    }

    return valid;
  }
}
