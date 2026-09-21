import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovimientosService, MovimientosResumen, StockArticulo } from '../../../services/movimientos.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-movimiento-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Movimientos</h1>
          <p>Vista consolidada de ingresos, solicitudes y stock por articulo</p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/dashboard" class="btn-back">← Dashboard</a>
        </div>
      </div>

      <div *ngIf="loading" class="loading-state">Cargando movimientos...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <ng-container *ngIf="!loading && data">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon stat-ingreso">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ data.stats.totalIngresado | number }}</span>
              <span class="stat-label">Total Ingresado</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-salida">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ data.stats.totalEntregado | number }}</span>
              <span class="stat-label">Total Entregado</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-stock">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ data.stats.stockDisponible | number }}</span>
              <span class="stat-label">Stock Disponible</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-pendiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ data.stats.solicitudesPendientes }}</span>
              <span class="stat-label">Solicitudes Pendientes</span>
            </div>
          </div>
        </div>

        <div class="tabs">
          <button class="tab" [class.active]="activeTab === 'stock'" (click)="activeTab = 'stock'">
            Stock por Articulo ({{ data.stock.length }})
          </button>
          <button class="tab" [class.active]="activeTab === 'ingresos'" (click)="activeTab = 'ingresos'">
            Ingresos Recientes ({{ data.ingresos.length }})
          </button>
          <button class="tab" [class.active]="activeTab === 'solicitudes'" (click)="activeTab = 'solicitudes'">
            Solicitudes ({{ data.solicitudes.length }})
          </button>
          <button class="tab" [class.active]="activeTab === 'salidas'" (click)="activeTab = 'salidas'">
            Salidas / Entregas ({{ data.salidas.length }})
          </button>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'stock'">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Articulo</th>
                  <th>Ingresado</th>
                  <th>Entregado</th>
                  <th>Mermas</th>
                  <th>Disponible</th>
                  <th>Avance</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="data.stock.length === 0">
                  <td colspan="6" class="empty-row">No hay articulos con movimiento</td>
                </tr>
                <tr *ngFor="let s of data.stock">
                  <td class="td-bold">{{ s.articulo }}</td>
                  <td>{{ s.totalIngresado | number }}</td>
                  <td>{{ s.totalEntregado | number }}</td>
                  <td [class.text-danger]="s.totalMermas > 0">{{ s.totalMermas | number }}</td>
                  <td>
                    <span class="stock-badge" [class.stock-bajo]="s.stockDisponible <= 10 && s.stockDisponible > 0" [class.stock-agotado]="s.stockDisponible === 0">
                      {{ s.stockDisponible | number }}
                    </span>
                  </td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="getAvancePercent(s)"></div>
                    </div>
                    <span class="progress-text">{{ getAvancePercent(s) | number:'1.0-0' }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'ingresos'">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Correlativo</th>
                  <th>Factura</th>
                  <th>Fecha</th>
                  <th>Tarimas</th>
                  <th>Detalles</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="data.ingresos.length === 0">
                  <td colspan="8" class="empty-row">No hay ingresos registrados</td>
                </tr>
                <tr *ngFor="let i of data.ingresos">
                  <td class="td-bold">{{ i.correlativo }}</td>
                  <td>{{ i.numeroFactura }}</td>
                  <td>{{ i.fechaIngreso | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ i.cantidadTarimas }}</td>
                  <td>{{ i.detalleCount }} lineas</td>
                  <td>{{ i.clienteNombre || '-' }}</td>
                  <td>
                    <span class="status-badge" [class]="'status-' + (i.status || 'pendiente')">
                      {{ i.status || 'pendiente' }}
                    </span>
                  </td>
                  <td>
                    <a [routerLink]="['/inventory/ingreso', i.id]" class="btn-action">Ver</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'solicitudes'">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Correlativo</th>
                  <th>Fecha</th>
                  <th>Solicitante</th>
                  <th>Cliente</th>
                  <th>Solicitado</th>
                  <th>Entregado</th>
                  <th>Progreso</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="data.solicitudes.length === 0">
                  <td colspan="9" class="empty-row">No hay solicitudes registradas</td>
                </tr>
                <tr *ngFor="let s of data.solicitudes">
                  <td class="td-bold">{{ s.correlativo }}</td>
                  <td>{{ s.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ s.solicitante }}</td>
                  <td>{{ s.clienteNombre || '-' }}</td>
                  <td>{{ s.totalSolicitado | number }}</td>
                  <td>{{ s.totalEntregado | number }}</td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="getSolicitudPercent(s)"></div>
                    </div>
                    <span class="progress-text">{{ getSolicitudPercent(s) | number:'1.0-0' }}%</span>
                  </td>
                  <td>
                    <span class="status-badge" [class]="'status-' + (s.estado || 'pendiente')">
                      {{ s.estado || 'pendiente' }}
                    </span>
                  </td>
                  <td>
                    <a [routerLink]="['/inventory/solicitudes', s.id]" class="btn-action">Ver</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="tab-content" *ngIf="activeTab === 'salidas'">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Solicitud</th>
                  <th>Articulo</th>
                  <th>Lote</th>
                  <th>Solicitado</th>
                  <th>Entregado</th>
                  <th>Pendiente</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="data.salidas.length === 0">
                  <td colspan="8" class="empty-row">No hay salidas registradas</td>
                </tr>
                <tr *ngFor="let sal of data.salidas">
                  <td class="td-bold">{{ sal.solicitudCorrelativo }}</td>
                  <td>{{ sal.articulo }}</td>
                  <td>{{ sal.lote }}</td>
                  <td>{{ sal.cantidadSolicitada | number }}</td>
                  <td>{{ sal.cantidadEntregada | number }}</td>
                  <td>
                    <span [class.text-danger]="sal.cantidadSolicitada - sal.cantidadEntregada > 0">
                      {{ sal.cantidadSolicitada - sal.cantidadEntregada | number }}
                    </span>
                  </td>
                  <td>{{ sal.clienteNombre || '-' }}</td>
                  <td>
                    <span class="status-badge" [class]="'status-' + (sal.solicitudEstado || 'pendiente')">
                      {{ sal.solicitudEstado || 'pendiente' }}
                    </span>
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
    .page-container { padding: 32px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .header-content h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
    .header-content p { font-size: 14px; color: var(--text-tertiary); margin: 0; }
    .btn-back { padding: 12px 24px; font-size: 14px; font-weight: 600; color: var(--text-secondary); background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition); }
    .btn-back:hover { background: var(--bg-hover); color: var(--text-primary); border-color: var(--accent-primary); }
    .loading-state { text-align: center; color: var(--text-tertiary); padding: 60px 0; font-size: 14px; }
    .error-message { padding: 14px 20px; background: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-lg); color: var(--danger-text); font-size: 14px; font-weight: 500; margin-bottom: 24px; }

    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); transition: var(--transition); }
    .stat-card:hover { border-color: var(--accent-primary); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .stat-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-ingreso { background: #dbeafe; color: #2563eb; }
    .stat-salida { background: #fef3c7; color: #d97706; }
    .stat-stock { background: #d1fae5; color: #059669; }
    .stat-pendiente { background: #fce7f3; color: #db2777; }
    .stat-info { display: flex; flex-direction: column; gap: 2px; }
    .stat-value { font-size: 24px; font-weight: 700; color: var(--text-primary); }
    .stat-label { font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; }

    .tabs { display: flex; gap: 4px; margin-bottom: 24px; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); padding: 4px; }
    .tab { padding: 10px 20px; font-size: 13px; font-weight: 500; color: var(--text-tertiary); background: none; border: none; border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); }
    .tab:hover { color: var(--text-primary); background: var(--bg-tertiary); }
    .tab.active { color: var(--accent-primary); background: var(--accent-bg); font-weight: 600; }

    .table-container { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 14px 16px; text-align: left; font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-primary); }
    .data-table td { padding: 12px 16px; font-size: 13px; color: var(--text-primary); border-bottom: 1px solid var(--border-primary); }
    .data-table tr:last-child td { border-bottom: none; }
    .empty-row { text-align: center; color: var(--text-tertiary); padding: 40px !important; }
    .td-bold { font-weight: 600; }
    .text-danger { color: var(--danger-text); }

    .stock-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; background: var(--success-bg); color: var(--success-text); }
    .stock-bajo { background: var(--warning-bg); color: var(--warning-text); }
    .stock-agotado { background: var(--danger-bg); color: var(--danger-text); }

    .progress-bar { width: 80px; height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; display: inline-block; vertical-align: middle; margin-right: 8px; }
    .progress-fill { height: 100%; background: var(--accent-primary); border-radius: 3px; transition: width 0.3s; }
    .progress-text { font-size: 12px; color: var(--text-tertiary); font-weight: 500; }

    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: capitalize; }
    .status-pendiente { background: var(--warning-bg); color: var(--warning-text); }
    .status-completado { background: var(--success-bg); color: var(--success-text); }
    .status-aprobado { background: var(--success-bg); color: var(--success-text); }
    .status-cancelado { background: var(--danger-bg); color: var(--danger-text); }
    .status-anulado { background: var(--bg-tertiary); color: var(--text-tertiary); }
    .status-rechazado { background: var(--danger-bg); color: var(--danger-text); }

    .btn-action { padding: 6px 12px; font-size: 12px; color: var(--accent-primary); background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: var(--radius-md); text-decoration: none; transition: var(--transition); cursor: pointer; }
    .btn-action:hover { background: var(--accent-primary); color: white; }
  `]
})
export class MovimientoDetailComponent implements OnInit {
  data: MovimientosResumen | null = null;
  loading = true;
  errorMessage = '';
  activeTab = 'stock';

  constructor(
    private movimientosService: MovimientosService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const companyId = this.authService.getCompanyId() || undefined;
    this.movimientosService.getResumen(companyId).subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los movimientos';
        this.loading = false;
      }
    });
  }

  getAvancePercent(s: StockArticulo): number {
    if (!s.totalIngresado || s.totalIngresado === 0) return 0;
    return Math.min(100, (s.totalEntregado / s.totalIngresado) * 100);
  }

  getSolicitudPercent(s: any): number {
    if (!s.totalSolicitado || s.totalSolicitado === 0) return 0;
    return Math.min(100, (s.totalEntregado / s.totalSolicitado) * 100);
  }
}
