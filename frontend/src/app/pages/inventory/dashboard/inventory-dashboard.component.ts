import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IngresoService } from '../../../services/ingreso.service';
import { Ingreso } from '../../../models/ingreso.model';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Dashboard de Inventario</h1>
          <p>Vision general del sistema de inventario</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading">
        <div class="spinner"></div>
        Cargando datos...
      </div>

      <div *ngIf="!isLoading">
        <div class="stats-grid">
          <div class="stat-card stat-ingresos">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.total }}</span>
              <span class="stat-label">Total Ingresos</span>
            </div>
          </div>

          <div class="stat-card stat-pendientes">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.pendientes }}</span>
              <span class="stat-label">Pendientes</span>
            </div>
          </div>

          <div class="stat-card stat-completados">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.completados }}</span>
              <span class="stat-label">Completados</span>
            </div>
          </div>

          <div class="stat-card stat-cancelados">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.cancelados }}</span>
              <span class="stat-label">Cancelados</span>
            </div>
          </div>

          <div class="stat-card stat-tarimas">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalTarimas }}</span>
              <span class="stat-label">Total Tarimas</span>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <div class="card quick-actions">
            <div class="card-header">
              <h3>Acciones Rapidas</h3>
            </div>
            <div class="card-body">
              <a routerLink="/inventory/ingreso/new" class="action-btn">
                <div class="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                </div>
                <div class="action-text">
                  <strong>Nuevo Ingreso</strong>
                  <span>Registrar entrada de productos</span>
                </div>
              </a>
              <a routerLink="/inventory/ingreso" class="action-btn">
                <div class="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <div class="action-text">
                  <strong>Ver Ingresos</strong>
                  <span>Lista de todos los ingresos</span>
                </div>
              </a>
              <a routerLink="/inventory/reportes/ingresos" class="action-btn">
                <div class="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <div class="action-text">
                  <strong>Reportes</strong>
                  <span>Ver reportes de ingresos</span>
                </div>
              </a>
            </div>
          </div>

          <div class="card recent-movements">
            <div class="card-header">
              <h3>Ingresos Recientes</h3>
              <a routerLink="/inventory/ingreso" class="view-all">Ver todos</a>
            </div>
            <div class="card-body">
              <div *ngIf="recentIngresos.length === 0" class="empty-state">
                <p>No hay ingresos recientes</p>
              </div>
              <div *ngIf="recentIngresos.length > 0" class="ingresos-list">
                <div *ngFor="let ingreso of recentIngresos" class="ingreso-item">
                  <div class="ingreso-info">
                    <span class="ingreso-correlativo">{{ ingreso.correlativo }}</span>
                    <span class="ingreso-factura">{{ ingreso.numeroFactura }}</span>
                  </div>
                  <div class="ingreso-meta">
                    <span class="ingreso-tarimas">{{ ingreso.cantidadTarimas }} tarimas</span>
                    <span class="status-badge" [class]="'status-' + ingreso.status">
                      {{ getEstadoLabel(ingreso.status || 'pendiente') }}
                    </span>
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
      margin-bottom: 32px;

      .header-content {
        h1 {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        p {
          font-size: 14px;
          color: var(--text-tertiary);
          margin: 0;
        }
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: var(--transition);

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-tertiary);
        }
      }

      &.stat-ingresos .stat-icon {
        background: var(--accent-bg);
        color: var(--accent-primary);
      }

      &.stat-pendientes .stat-icon {
        background: var(--warning-bg);
        color: var(--warning-text);
      }

      &.stat-completados .stat-icon {
        background: var(--success-bg);
        color: var(--success-text);
      }

      &.stat-cancelados .stat-icon {
        background: var(--danger-bg);
        color: var(--danger-text);
      }

      &.stat-tarimas .stat-icon {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-primary);

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }

      .view-all {
        font-size: 13px;
        color: var(--accent-primary);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .card-body {
      padding: 24px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      text-decoration: none;
      margin-bottom: 12px;
      transition: var(--transition);
      cursor: pointer;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        border-color: var(--accent-primary);
        background: var(--accent-bg);
      }

      .action-icon {
        width: 40px;
        height: 40px;
        background: var(--accent-bg);
        color: var(--accent-primary);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .action-text {
        display: flex;
        flex-direction: column;

        strong {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        span {
          font-size: 12px;
          color: var(--text-tertiary);
        }
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

    .ingresos-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ingreso-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-primary);

      .ingreso-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .ingreso-correlativo {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .ingreso-factura {
          font-size: 12px;
          color: var(--text-tertiary);
        }
      }

      .ingreso-meta {
        display: flex;
        align-items: center;
        gap: 12px;

        .ingreso-tarimas {
          font-size: 12px;
          color: var(--text-secondary);
        }
      }
    }

    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
    }

    .status-pendiente {
      background: var(--warning-bg);
      color: var(--warning-text);
    }

    .status-completado {
      background: var(--success-bg);
      color: var(--success-text);
    }

    .status-cancelado {
      background: var(--danger-bg);
      color: var(--danger-text);
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InventoryDashboardComponent implements OnInit {
  stats = {
    total: 0,
    pendientes: 0,
    completados: 0,
    cancelados: 0,
    totalTarimas: 0
  };
  
  recentIngresos: Ingreso[] = [];
  isLoading = true;

  constructor(private ingresoService: IngresoService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.ingresoService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loadRecentIngresos();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadRecentIngresos() {
    this.ingresoService.getRecent(5).subscribe({
      next: (ingresos) => {
        this.recentIngresos = ingresos;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: any = { pendiente: 'Pendiente', completado: 'Completado', cancelado: 'Cancelado' };
    return labels[estado] || estado;
  }
}
