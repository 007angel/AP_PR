import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

      <div class="stats-grid">
        <div class="stat-card stat-ingresos">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalIngresos }}</span>
            <span class="stat-label">Total Ingresos</span>
          </div>
        </div>

        <div class="stat-card stat-salidas">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 19V5M5 12l7-7 7 7"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalSalidas }}</span>
            <span class="stat-label">Total Salidas</span>
          </div>
        </div>

        <div class="stat-card stat-solicitudes">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalSolicitudes }}</span>
            <span class="stat-label">Solicitudes Pendientes</span>
          </div>
        </div>

        <div class="stat-card stock">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stockActual }}</span>
            <span class="stat-label">Stock Actual</span>
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
            <a routerLink="/inventory/salida/new" class="action-btn">
              <div class="action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 19V5M5 12l7-7 7 7"></path>
                </svg>
              </div>
              <div class="action-text">
                <strong>Nueva Salida</strong>
                <span>Registrar salida de productos</span>
              </div>
            </a>
            <a routerLink="/inventory/solicitudes/new" class="action-btn">
              <div class="action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div class="action-text">
                <strong>Nueva Solicitud</strong>
                <span>Crear solicitud de productos</span>
              </div>
            </a>
            <a routerLink="/inventory/reportes" class="action-btn">
              <div class="action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <div class="action-text">
                <strong>Ver Reportes</strong>
                <span>Consultar reportes del inventario</span>
              </div>
            </a>
          </div>
        </div>

        <div class="card recent-movements">
          <div class="card-header">
            <h3>Movimientos Recientes</h3>
            <a routerLink="/inventory/reportes/movimientos" class="view-all">Ver todos</a>
          </div>
          <div class="card-body">
            <div class="empty-state">
              <p>No hay movimientos recientes</p>
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
        background: var(--success-bg);
        color: var(--success-text);
      }

      &.stat-salidas .stat-icon {
        background: var(--danger-bg);
        color: var(--danger-text);
      }

      &.stat-solicitudes .stat-icon {
        background: var(--warning-bg);
        color: var(--warning-text);
      }

      &.stock .stat-icon {
        background: var(--accent-bg);
        color: var(--accent-primary);
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

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InventoryDashboardComponent implements OnInit {
  totalIngresos = 0;
  totalSalidas = 0;
  totalSolicitudes = 0;
  stockActual = 0;

  constructor() {}

  ngOnInit() {
    // TODO: Load inventory data from API
    this.loadStats();
  }

  loadStats() {
    // Placeholder - will connect to backend
    this.totalIngresos = 0;
    this.totalSalidas = 0;
    this.totalSolicitudes = 0;
    this.stockActual = 0;
  }
}
