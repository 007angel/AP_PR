import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movimiento-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <a routerLink="/inventory/ingreso" class="back-link">← Volver a Ingresos</a>
          <h1>Detalle de Movimiento #{{ movimientoId }}</h1>
          <p>Informacion del movimiento de inventario</p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/dashboard" class="btn-back">
            ← Dashboard
          </a>
        </div>
      </div>

      <div class="detail-card">
        <h3>Informacion del Movimiento</h3>
        <div class="detail-row">
          <span class="label">ID Movimiento:</span>
          <span class="value">{{ movimientoId }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Tipo:</span>
          <span class="value">-</span>
        </div>
        <div class="detail-row">
          <span class="label">Producto:</span>
          <span class="value">-</span>
        </div>
        <div class="detail-row">
          <span class="label">Cantidad:</span>
          <span class="value">-</span>
        </div>
        <div class="detail-row">
          <span class="label">Fecha:</span>
          <span class="value">-</span>
        </div>
        <div class="detail-row">
          <span class="label">Responsable:</span>
          <span class="value">-</span>
        </div>
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
    .detail-card { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); padding: 24px; max-width: 600px; }
    .detail-card h3 { font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0 0 20px 0; padding-bottom: 12px; border-bottom: 1px solid var(--border-primary); }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-primary); }
    .detail-row:last-child { border-bottom: none; }
    .label { font-size: 14px; color: var(--text-tertiary); }
    .value { font-size: 14px; font-weight: 500; color: var(--text-primary); }
  `]
})
export class MovimientoDetailComponent implements OnInit {
  movimientoId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.movimientoId = this.route.snapshot.paramMap.get('id') || '';
  }
}
