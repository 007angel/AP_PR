import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ModuloService } from '../../services/modulo.service';
import { Modulo } from '../../models/modulo.model';

@Component({
  selector: 'app-inventory-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <span class="logo-text">Inventario</span>
        </div>

        <nav class="sidebar-nav">
          <ng-container *ngFor="let grupo of grupos">
            <div class="nav-section" *ngIf="grupo.nombre">{{ grupo.nombre }}</div>
            <a *ngFor="let modulo of grupo.modulos"
              [routerLink]="modulo.ruta"
              routerLinkActive="active"
              class="nav-item">
              <span class="nav-emoji">{{ modulo.icono || '📦' }}</span>
              <span>{{ modulo.nombre }}</span>
            </a>
          </ng-container>
          <div *ngIf="!isLoadingMenu && grupos.length === 0" class="menu-empty">
            Sin módulos activos
          </div>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/dashboard" class="nav-item back-main">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            <span>Volver al Menu</span>
          </a>
        </div>
      </aside>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 260px;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border-primary);
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      z-index: 100;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      border-bottom: 1px solid var(--border-primary);
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
    }

    .nav-section {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 12px 8px;
    }

    .menu-empty {
      padding: 16px 12px;
      font-size: 13px;
      color: var(--text-tertiary);
    }

    .nav-emoji {
      font-size: 20px;
      width: 20px;
      text-align: center;
      line-height: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: var(--transition);
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;

      &:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
      }

      &.active {
        background: var(--accent-bg);
        color: var(--accent-primary);
      }

      &.back-main {
        margin-top: 8px;
        border-top: 1px solid var(--border-primary);
        padding-top: 16px;
      }
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--border-primary);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .main-content {
      flex: 1;
      margin-left: 260px;
      background: var(--bg-primary);
      min-height: 100vh;
    }
  `]
})
export class InventoryLayoutComponent implements OnInit {
  grupos: { nombre: string | null; modulos: Modulo[] }[] = [];
  isLoadingMenu = true;

  constructor(private moduloService: ModuloService) {}

  ngOnInit() {
    this.moduloService.findActivos().subscribe({
      next: (data) => {
        this.grupos = this.agruparPorSeccion(data);
        this.isLoadingMenu = false;
      },
      error: () => {
        this.grupos = [];
        this.isLoadingMenu = false;
      }
    });
  }

  private agruparPorSeccion(modulos: Modulo[]): { nombre: string | null; modulos: Modulo[] }[] {
    const grupos: { nombre: string | null; modulos: Modulo[] }[] = [];
    for (const modulo of modulos) {
      const seccion = modulo.seccion || null;
      let grupo = grupos.find(g => g.nombre === seccion);
      if (!grupo) {
        grupo = { nombre: seccion, modulos: [] };
        grupos.push(grupo);
      }
      grupo.modulos.push(modulo);
    }
    return grupos;
  }
}
