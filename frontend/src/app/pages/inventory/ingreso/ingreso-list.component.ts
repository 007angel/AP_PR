import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IngresoService } from '../../../services/ingreso.service';
import { IngresoDetalleService } from '../../../services/ingreso-detalle.service';
import { AnulacionService } from '../../../services/anulacion.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../../../shared/confirm-dialog/confirm.service';
import { ExcelUploadComponent } from '../../../shared/excel-upload/excel-upload.component';
import { Ingreso } from '../../../models/ingreso.model';
import { IngresoDetalle } from '../../../models/ingreso-detalle.model';

@Component({
  selector: 'app-ingreso-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialogComponent, ExcelUploadComponent],
  template: `
    <div class="page-container">
      <app-confirm-dialog></app-confirm-dialog>
      <app-excel-upload #excelUpload (uploaded)="onExcelUploaded($event)"></app-excel-upload>
      <div class="page-header">
        <div class="header-content">
          <h1>Ingresos</h1>
          <p>Gestion de entradas de productos al inventario</p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/dashboard" class="btn-back">
            ← Dashboard
          </a>
          <button class="btn-excel" (click)="excelUpload.open()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <polyline points="9 15 12 12 15 15"></polyline>
            </svg>
            Subir Excel
          </button>
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
              <th class="col-toggle"></th>
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
              <td colspan="9" class="empty-row">No hay ingresos registrados</td>
            </tr>
            <ng-container *ngFor="let ingreso of ingresos">
              <tr [class.row-expanded]="isExpanded(ingreso.id!)">
                <td class="col-toggle">
                  <button class="btn-toggle" [class.expanded]="isExpanded(ingreso.id!)" (click)="toggleDetalle(ingreso.id!)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </td>
                <td>{{ ingreso.correlativo }}</td>
                <td>{{ ingreso.numeroFactura }}</td>
                <td>{{ ingreso.fechaIngreso | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ ingreso.fechaDigitacion | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ ingreso.cantidadTarimas }}</td>
                <td>{{ ingreso.usuarioDigito }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + (ingreso.status || 'pendiente')">
                    {{ getEstadoLabel(ingreso.status || 'pendiente') }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <a [routerLink]="['/inventory/ingreso', ingreso.id]" class="btn-action">Ver</a>
                    <a [routerLink]="['/inventory/ingreso', ingreso.id, 'detalle']" class="btn-action btn-detalle">Detalle</a>
                    <button class="btn-action btn-delete" (click)="deleteIngreso(ingreso.id!)">Anular</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="isExpanded(ingreso.id!)" class="detail-row">
                <td colspan="9">
                  <div class="detail-container">
                    <div *ngIf="loadingDetalles[ingreso.id!]" class="detail-loading">Cargando detalles...</div>
                    <div *ngIf="!loadingDetalles[ingreso.id!] && getDetalles(ingreso.id!).length === 0" class="detail-empty">
                      Sin detalles registrados
                    </div>
                    <table *ngIf="!loadingDetalles[ingreso.id!] && getDetalles(ingreso.id!).length > 0" class="detail-table">
                      <thead>
                        <tr>
                          <th>Articulo</th>
                          <th>Lote</th>
                          <th>Tarima</th>
                          <th>Cajas</th>
                          <th>Unidades</th>
                          <th>Total</th>
                          <th>Solicitado</th>
                          <th>Entregado</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let det of getDetalles(ingreso.id!)">
                          <td>{{ det.articulo }}</td>
                          <td>{{ det.lote }}</td>
                          <td>{{ det.tarima }}</td>
                          <td>{{ det.caja }}</td>
                          <td>{{ det.unidad }}</td>
                          <td>{{ det.totalIngreso }}</td>
                          <td>{{ det.solicitado }}</td>
                          <td>{{ det.entregado }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </ng-container>
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
    .status-anulado { background: var(--bg-tertiary); color: var(--text-tertiary); }
    .action-buttons { display: flex; gap: 8px; }
    .btn-action { padding: 6px 12px; font-size: 12px; color: var(--accent-primary); background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition); cursor: pointer; }
    .btn-action:hover { background: var(--accent-primary); color: white; }
    .btn-detalle { color: var(--success-text); background: var(--success-bg); border-color: var(--success-border); }
    .btn-detalle:hover { background: var(--success-text); color: white; }
    .btn-delete { color: var(--danger-text); background: var(--danger-bg); border-color: var(--danger-border); }
    .btn-delete:hover { background: var(--danger); color: white; }
    .btn-excel { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #059669; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); }
    .btn-excel:hover { background: #059669; color: white; border-color: #059669; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3); }

    .col-toggle { width: 40px; text-align: center; }
    .btn-toggle { background: none; border: 1px solid var(--border-primary); border-radius: var(--radius-sm); width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); color: var(--text-tertiary); }
    .btn-toggle:hover { background: var(--bg-tertiary); color: var(--text-primary); border-color: var(--accent-primary); }
    .btn-toggle.expanded { background: var(--accent-bg); color: var(--accent-primary); border-color: var(--accent-border); transform: rotate(90deg); }
    .row-expanded td { background: var(--bg-tertiary); }

    .detail-row td { padding: 0 !important; border-bottom: 1px solid var(--border-primary); }
    .detail-container { padding: 16px 24px 16px 56px; background: var(--bg-primary); border-top: 1px dashed var(--border-primary); }
    .detail-loading, .detail-empty { color: var(--text-tertiary); font-size: 13px; padding: 12px 0; }
    .detail-table { width: 100%; border-collapse: collapse; }
    .detail-table th { padding: 8px 12px; font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; text-align: left; background: var(--bg-tertiary); border-radius: var(--radius-sm); }
    .detail-table td { padding: 8px 12px; font-size: 13px; color: var(--text-primary); border-bottom: 1px solid var(--border-primary); }
    .detail-table tr:last-child td { border-bottom: none; }
  `]
})
export class IngresoListComponent {
  @ViewChild('excelUpload') excelUpload!: ExcelUploadComponent;
  ingresos: Ingreso[] = [];
  successMessage = '';
  errorMessage = '';

  expandedSet: Set<number> = new Set();
  detallesCache: { [key: number]: IngresoDetalle[] } = {};
  loadingDetalles: { [key: number]: boolean } = {};

  constructor(
    private ingresoService: IngresoService,
    private ingresoDetalleService: IngresoDetalleService,
    private anulacionService: AnulacionService,
    private authService: AuthService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.loadIngresos();
  }

  loadIngresos() {
    const companyId = this.authService.getCompanyId();
    const request = companyId
      ? this.ingresoService.findByCompany(companyId)
      : this.ingresoService.findAll();
    request.subscribe({
      next: (ingresos) => {
        this.ingresos = ingresos
          .filter(i => i.status === 'pendiente' || i.status === 'completado')
          .sort((a, b) => (b.id || 0) - (a.id || 0));
      },
      error: () => {
        this.errorMessage = 'Error al cargar los ingresos';
      }
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: any = { pendiente: 'Pendiente', completado: 'Completado', cancelado: 'Cancelado', anulado: 'Anulado' };
    return labels[estado] || estado;
  }

  isExpanded(id: number): boolean {
    return this.expandedSet.has(id);
  }

  getDetalles(id: number): IngresoDetalle[] {
    return this.detallesCache[id] || [];
  }

  toggleDetalle(id: number) {
    if (this.expandedSet.has(id)) {
      this.expandedSet.delete(id);
    } else {
      this.expandedSet.add(id);
      this.loadingDetalles[id] = true;
      this.ingresoDetalleService.findByIngreso(id).subscribe({
        next: (detalles) => {
          this.detallesCache[id] = detalles;
          this.loadingDetalles[id] = false;
        },
        error: () => {
          this.detallesCache[id] = [];
          this.loadingDetalles[id] = false;
        }
      });
    }
  }

  deleteIngreso(id: number) {
    const ingreso = this.ingresos.find(i => i.id === id);
    this.confirmService.prompt({
      title: 'Solicitar anulacion',
      message: `La anulacion del ingreso ${ingreso?.correlativo || '#' + id} requiere autorizacion del master.`,
      inputLabel: 'Motivo de la anulacion',
      inputPlaceholder: 'Describa el motivo (opcional)',
      confirmText: 'Enviar solicitud',
      cancelText: 'Cancelar'
    }).subscribe(motivo => {
      if (motivo === null) {
        return;
      }
      this.anulacionService.create({
        ingresoId: id,
        motivo: motivo,
        solicitadoPor: this.authService.getUser()?.id || null,
        companyId: this.authService.getCompanyId()
      }).subscribe({
        next: () => {
          this.successMessage = 'Solicitud de anulacion enviada al master';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al enviar la solicitud';
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    });
  }

  onExcelUploaded(result: any) {
    this.successMessage = result.message || 'Ingreso creado exitosamente desde Excel';
    this.loadIngresos();
    setTimeout(() => { this.successMessage = ''; }, 5000);
  }
}
