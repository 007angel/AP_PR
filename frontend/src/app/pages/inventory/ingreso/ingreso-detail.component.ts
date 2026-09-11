import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ingreso-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <a routerLink="/inventory/ingreso" class="back-link">← Volver a Ingresos</a>
          <h1>Encabezado de Ingreso</h1>
          <p>Informacion detallada del ingreso al inventario</p>
        </div>
        <div class="header-actions">
          <a routerLink="/inventory/dashboard" class="btn-back">
            ← Dashboard
          </a>
        </div>
      </div>

      <div class="detail-card">
        <h3>Datos del Ingreso</h3>
        <div class="detail-grid">
          <div class="detail-row">
            <span class="label">Correlativo Ingreso:</span>
            <span class="value">{{ ingreso.correlativo }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Numero de Factura:</span>
            <span class="value">{{ ingreso.numeroFactura }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Fecha de Ingreso:</span>
            <span class="value">{{ ingreso.fechaIngreso | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Fecha de Digitacion:</span>
            <span class="value">{{ ingreso.fechaDigitacion | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Cantidad de Tarimas:</span>
            <span class="value">{{ ingreso.cantidadTarimas }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Usuario que Digito:</span>
            <span class="value">{{ ingreso.usuarioDigito }}</span>
          </div>
        </div>
      </div>

      <div class="detail-card">
        <h3>Productos Ingresados</h3>
        <div class="empty-state">
          <p>No hay productos registrados en este ingreso</p>
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
    .detail-card { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; }
    .detail-card h3 { font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0 0 20px 0; padding-bottom: 12px; border-bottom: 1px solid var(--border-primary); }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .detail-row { display: flex; flex-direction: column; gap: 6px; padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-md); }
    .label { font-size: 12px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 16px; font-weight: 500; color: var(--text-primary); }
    .empty-state { text-align: center; padding: 40px; color: var(--text-tertiary); }
    .empty-state p { margin: 0; font-size: 14px; }

    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class IngresoDetailComponent implements OnInit {
  ingresoId: string = '';
  
  ingreso = {
    correlativo: 'ING-00001',
    numeroFactura: 'FAC-2026-001',
    fechaIngreso: new Date(),
    fechaDigitacion: new Date(),
    cantidadTarimas: 0,
    usuarioDigito: '-'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.ingresoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.ingresoId) {
      this.loadIngreso();
    }
  }

  loadIngreso() {
    // TODO: Load from API
    // For now using placeholder data
    this.ingreso = {
      correlativo: `ING-${this.ingresoId.padStart(5, '0')}`,
      numeroFactura: 'FAC-2026-001',
      fechaIngreso: new Date(),
      fechaDigitacion: new Date(),
      cantidadTarimas: 0,
      usuarioDigito: '-'
    };
  }
}
