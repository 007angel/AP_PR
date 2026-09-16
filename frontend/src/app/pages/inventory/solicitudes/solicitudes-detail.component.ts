import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { SolicitudService } from '../../../services/solicitud.service';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { AvailableArticle, SolicitudDetalle } from '../../../models/solicitud.model';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-solicitudes-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <a routerLink="/inventory/solicitudes" class="back-link">← Volver a Solicitudes</a>
          <h1>{{ solicitudId ? 'Detalle de Solicitud' : 'Nueva Solicitud' }}</h1>
          <p *ngIf="solicitudId" class="correlativo">{{ solicitud?.correlativo }}</p>
        </div>
      </div>

      <!-- Vista Detalle (cuando existe solicitud) -->
      <div *ngIf="solicitudId && solicitud" class="detail-view">
        <div class="detail-grid">
          <div class="detail-card">
            <h3>Información General</h3>
            <div class="detail-row">
              <span class="label">Solicitante:</span>
              <span class="value">{{ solicitud.solicitante }}</span>
            </div>
            <div class="detail-row" *ngIf="solicitud.cliente">
              <span class="label">Cliente:</span>
              <span class="value">{{ solicitud.cliente.nombre }} {{ solicitud.cliente.rif ? '(' + solicitud.cliente.rif + ')' : '' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fecha:</span>
              <span class="value">{{ solicitud.fecha | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Estado:</span>
              <span class="status-badge" [class]="'status-' + solicitud.estado">
                {{ getEstadoLabel(solicitud.estado) }}
              </span>
            </div>
            <div class="detail-row" *ngIf="solicitud.observaciones">
              <span class="label">Observaciones:</span>
              <span class="value">{{ solicitud.observaciones }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Creado por:</span>
              <span class="value">{{ solicitud.user?.name || 'N/A' }}</span>
            </div>
          </div>

          <div class="detail-card">
            <h3>Resumen</h3>
            <div class="summary-stats">
              <div class="summary-item">
                <span class="summary-label">Artículos</span>
                <span class="summary-value">{{ solicitud.detalles?.length || 0 }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Solicitado</span>
                <span class="summary-value">{{ solicitud.totalSolicitado }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Entregado</span>
                <span class="summary-value entregado">{{ solicitud.totalEntregado }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de Detalles -->
        <div class="table-container">
          <div class="table-header">
            <h3>Artículos Solicitados</h3>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Lote</th>
                <th>Ingreso Origen</th>
                <th>Cant. Solicitada</th>
                <th>Cant. Entregada</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let det of solicitud.detalles">
                <td><strong>{{ det.articulo }}</strong></td>
                <td>{{ det.lote || '—' }}</td>
                <td>
                  <span *ngIf="det.ingresoId" class="ingreso-tag">
                    Ver ingreso #{{ det.ingresoId }}
                  </span>
                  <span *ngIf="!det.ingresoId" class="sin-stock">Sin stock</span>
                </td>
                <td>{{ det.cantidadSolicitada }}</td>
                <td>{{ det.cantidadEntregada }}</td>
                <td>
                  <span class="status-badge"
                    [class.status-pendiente]="det.cantidadEntregada === 0"
                    [class.status-completado]="det.cantidadEntregada >= det.cantidadSolicitada"
                    [class.status-aprobado]="det.cantidadEntregada > 0 && det.cantidadEntregada < det.cantidadSolicitada"
                  >
                    {{ getDetalleEstado(det) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Formulario Nueva Solicitud -->
      <div *ngIf="!solicitudId" class="form-view">
        <div class="form-grid">
          <!-- Datos del solicitante -->
          <div class="form-card">
            <div class="card-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <h3>Datos del Solicitante</h3>
            </div>

            <!-- Selector de Cliente -->
            <div class="form-group">
              <label>Cliente / Solicitante *</label>
              <div class="client-selector">
                <div class="client-search-wrapper">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    [(ngModel)]="clienteSearch"
                    (input)="onClienteSearch()"
                    (focus)="showClientDropdown = true"
                    placeholder="Buscar cliente existente..."
                    class="form-input client-input"
                  />
                </div>
                <div class="client-dropdown" *ngIf="showClientDropdown && filteredClientes.length > 0">
                  <div
                    class="client-option"
                    *ngFor="let c of filteredClientes"
                    (click)="selectCliente(c)"
                  >
                    <span class="option-name">{{ c.nombre }}</span>
                    <span class="option-meta">{{ c.rif || '' }} {{ c.telefono ? '· ' + c.telefono : '' }}</span>
                  </div>
                </div>
                <div class="client-selected" *ngIf="selectedCliente">
                  <span class="selected-tag">
                    {{ selectedCliente.nombre }}
                    <button class="tag-remove" (click)="clearCliente()">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                </div>
              </div>
              <div class="client-actions">
                <button class="btn-link" (click)="showNewClientForm = !showNewClientForm">
                  {{ showNewClientForm ? 'Cancelar' : '+ Crear nuevo cliente' }}
                </button>
              </div>

              <!-- Formulario nuevo cliente rápido -->
              <div class="quick-client-form" *ngIf="showNewClientForm">
                <div class="form-row">
                  <input type="text" [(ngModel)]="newClient.nombre" placeholder="Nombre *" class="form-input-sm" />
                  <input type="text" [(ngModel)]="newClient.rif" placeholder="RIF" class="form-input-sm" />
                  <input type="text" [(ngModel)]="newClient.telefono" placeholder="Teléfono" class="form-input-sm" />
                </div>
                <div class="form-row">
                  <input type="email" [(ngModel)]="newClient.email" placeholder="Email" class="form-input-sm" />
                  <input type="text" [(ngModel)]="newClient.contacto" placeholder="Contacto" class="form-input-sm" />
                </div>
                <button class="btn-add-client" (click)="createAndSelectClient()" [disabled]="!newClient.nombre?.trim()">
                  Guardar y seleccionar
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Observaciones</label>
              <textarea
                [(ngModel)]="observaciones"
                placeholder="Observaciones adicionales (opcional)"
                class="form-input"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Selector de Artículos -->
          <div class="form-card articles-card">
            <div class="card-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <h3>Seleccionar Artículos del Inventario</h3>
            </div>

            <!-- Buscador -->
            <div class="search-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterArticles()"
                placeholder="Buscar artículo por nombre o lote..."
                class="search-input"
              />
            </div>

            <!-- Lista de artículos disponibles -->
            <div class="articles-list">
              <div *ngIf="loadingArticles" class="loading-state">
                <span>Cargando artículos disponibles...</span>
              </div>
              <div *ngIf="!loadingArticles && filteredArticles.length === 0" class="empty-state">
                No se encontraron artículos disponibles
              </div>
              <div
                *ngFor="let art of filteredArticles"
                class="article-item"
                [class.selected]="isArticleSelected(art)"
              >
                <div class="article-info">
                  <span class="article-name">{{ art.articulo }}</span>
                  <span class="article-meta">
                    Lote: {{ art.lote }} &middot; Disponible: <strong>{{ art.disponible }}</strong>
                  </span>
                  <span class="article-source">
                    Ingreso: {{ art.ingresoCorrelativo }} ({{ art.numeroFactura }})
                  </span>
                </div>
                <div class="article-action">
                  <button
                    class="btn-add"
                    *ngIf="!isArticleSelected(art)"
                    (click)="addArticle(art)"
                    [disabled]="art.disponible <= 0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Agregar
                  </button>
                  <span *ngIf="isArticleSelected(art)" class="added-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Agregado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Artículos Seleccionados -->
        <div class="selected-card" *ngIf="selectedItems.length > 0">
          <div class="card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <h3>Artículos Seleccionados ({{ selectedItems.length }})</h3>
          </div>

          <div class="selected-items">
            <div *ngFor="let item of selectedItems; let i = index" class="selected-item" [class.over-limit]="item.cantidad > item.disponible">
              <div class="item-info">
                <span class="item-name">{{ item.articulo }}</span>
                <span class="item-meta">Lote: {{ item.lote }} &middot; Máx: <strong>{{ item.disponible }}</strong></span>
              </div>
              <div class="item-qty">
                <label>Cantidad:</label>
                <input
                  type="number"
                  [(ngModel)]="item.cantidad"
                  [max]="item.disponible"
                  min="1"
                  class="qty-input"
                  [class.input-error]="item.cantidad > item.disponible"
                  (change)="validateQty(item)"
                />
              </div>
              <span class="over-limit-msg" *ngIf="item.cantidad > item.disponible">
                Máximo {{ item.disponible }}
              </span>
              <button class="btn-remove" (click)="removeItem(i)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" (click)="clearSelection()">Limpiar Todo</button>
            <button
              class="btn-primary"
              (click)="submitSolicitud()"
              [disabled]="!canSubmit || isSubmitting"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {{ isSubmitting ? 'Enviando...' : 'Enviar Solicitud' }}
            </button>
          </div>
        </div>

        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 1200px; }
    .page-header { margin-bottom: 28px; }
    .back-link { display: inline-block; font-size: 13px; color: var(--text-tertiary); text-decoration: none; margin-bottom: 12px; transition: var(--transition); }
    .back-link:hover { color: var(--accent-primary); }
    .header-content h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .correlativo { font-size: 14px; color: var(--accent-primary); font-weight: 600; margin: 4px 0 0; }

    /* Detail View */
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .detail-card, .form-card { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); padding: 24px; }
    .detail-card h3, .card-header h3 { font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0 0 16px; }
    .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: var(--accent-primary); }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-primary); }
    .detail-row:last-child { border-bottom: none; }
    .label { font-size: 13px; color: var(--text-tertiary); }
    .value { font-size: 14px; font-weight: 500; color: var(--text-primary); }

    .summary-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .summary-item { text-align: center; padding: 14px; background: var(--bg-tertiary); border-radius: var(--radius-md); }
    .summary-label { display: block; font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .summary-value { font-size: 22px; font-weight: 700; color: var(--text-primary); }
    .summary-value.entregado { color: var(--success-text); }

    .ingreso-tag { font-size: 12px; padding: 3px 8px; background: var(--accent-bg); color: var(--accent-primary); border-radius: 4px; }
    .sin-stock { font-size: 12px; color: var(--text-muted); font-style: italic; }

    /* Table */
    .table-container { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); overflow: hidden; }
    .table-header { padding: 16px 20px; border-bottom: 1px solid var(--border-primary); }
    .table-header h3 { margin: 0; font-size: 15px; font-weight: 600; color: var(--text-primary); }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; background: var(--bg-tertiary); }
    .data-table td { padding: 14px 16px; font-size: 14px; color: var(--text-primary); border-bottom: 1px solid var(--border-primary); }
    .data-table tr:last-child td { border-bottom: none; }

    .status-badge { padding: 4px 10px; border-radius: 16px; font-size: 11px; font-weight: 600; }
    .status-pendiente { background: var(--warning-bg); color: var(--warning-text); }
    .status-aprobado { background: #dbeafe; color: #2563eb; }
    .status-completado { background: var(--success-bg); color: var(--success-text); }
    .status-rechazado { background: var(--danger-bg); color: var(--danger-text); }

    /* Form */
    .form-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; margin-bottom: 24px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; }
    .form-input { width: 100%; padding: 10px 14px; font-size: 14px; border: 1px solid var(--border-primary); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); outline: none; transition: var(--transition); box-sizing: border-box; }
    .form-input:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    textarea.form-input { resize: vertical; font-family: inherit; }

    /* Client Selector */
    .client-selector { position: relative; }
    .client-search-wrapper { display: flex; align-items: center; gap: 8px; padding: 0 12px; background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); }
    .client-search-wrapper svg { color: var(--text-muted); flex-shrink: 0; }
    .client-input { border: none !important; box-shadow: none !important; padding-left: 0 !important; }
    .client-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); max-height: 200px; overflow-y: auto; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.12); margin-top: 4px; }
    .client-option { padding: 10px 14px; cursor: pointer; display: flex; flex-direction: column; gap: 2px; transition: background 0.15s; }
    .client-option:hover { background: var(--accent-light); }
    .option-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .option-meta { font-size: 12px; color: var(--text-muted); }
    .client-selected { margin-top: 8px; }
    .selected-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; background: var(--accent-light); color: var(--accent-primary); border-radius: 16px; font-size: 13px; font-weight: 600; }
    .tag-remove { border: none; background: none; cursor: pointer; color: var(--accent-primary); padding: 2px; display: flex; opacity: 0.6; }
    .tag-remove:hover { opacity: 1; }
    .client-actions { margin-top: 8px; }
    .btn-link { border: none; background: none; color: var(--accent-primary); font-size: 13px; font-weight: 600; cursor: pointer; padding: 0; }
    .btn-link:hover { text-decoration: underline; }
    .quick-client-form { margin-top: 12px; padding: 14px; background: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-primary); }
    .form-row { display: flex; gap: 8px; margin-bottom: 8px; }
    .form-input-sm { flex: 1; padding: 8px 10px; font-size: 13px; border: 1px solid var(--border-primary); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); outline: none; }
    .form-input-sm:focus { border-color: var(--accent-primary); }
    .btn-add-client { width: 100%; padding: 8px; font-size: 13px; font-weight: 600; color: white; background: var(--accent-primary); border: none; border-radius: var(--radius-md); cursor: pointer; }
    .btn-add-client:hover { background: var(--accent-hover); }
    .btn-add-client:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Search */
    .search-bar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); margin-bottom: 16px; color: var(--text-muted); }
    .search-input { flex: 1; border: none; background: transparent; font-size: 14px; color: var(--text-primary); outline: none; }
    .search-input::placeholder { color: var(--text-muted); }

    /* Articles List */
    .articles-list { max-height: 360px; overflow-y: auto; }
    .loading-state, .empty-state { text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px; }
    .article-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border: 1px solid var(--border-primary); border-radius: var(--radius-md); margin-bottom: 8px; transition: var(--transition); }
    .article-item:hover { border-color: var(--accent-primary); background: var(--accent-light); }
    .article-item.selected { border-color: var(--success); background: rgba(16, 185, 129, 0.04); }
    .article-info { display: flex; flex-direction: column; gap: 3px; }
    .article-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .article-meta { font-size: 12px; color: var(--text-secondary); }
    .article-meta strong { color: var(--accent-primary); }
    .article-source { font-size: 11px; color: var(--text-muted); }

    .btn-add { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: var(--accent-primary); background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); }
    .btn-add:hover:not(:disabled) { background: var(--accent-primary); color: white; }
    .btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
    .added-badge { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; font-size: 12px; font-weight: 600; color: var(--success-text); background: var(--success-bg); border-radius: var(--radius-md); }

    /* Selected Items */
    .selected-card { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 20px; }
    .selected-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .selected-item { display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: var(--bg-tertiary); border-radius: var(--radius-md); }
    .item-info { flex: 1; }
    .item-name { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .item-meta { font-size: 12px; color: var(--text-muted); }
    .item-qty { display: flex; align-items: center; gap: 8px; }
    .item-qty label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
    .qty-input { width: 70px; padding: 6px 10px; font-size: 14px; font-weight: 600; text-align: center; border: 1px solid var(--border-primary); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); outline: none; }
    .qty-input:focus { border-color: var(--accent-primary); }
    .qty-input.input-error { border-color: #ef4444; background: #fef2f2; color: #dc2626; }
    .selected-item.over-limit { border-color: #fca5a5; background: #fef2f2; }
    .over-limit-msg { font-size: 11px; font-weight: 600; color: #dc2626; white-space: nowrap; }
    .btn-remove { width: 30px; height: 30px; border: none; background: var(--danger-bg); color: var(--danger-text); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
    .btn-remove:hover { background: var(--danger); color: white; }

    .form-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border-primary); }
    .btn-primary, .btn-secondary { display: inline-flex; align-items: center; gap: 6px; padding: 12px 24px; border: none; border-radius: var(--radius-md); font-size: 14px; font-weight: 600; cursor: pointer; transition: var(--transition); }
    .btn-primary { background: var(--accent-primary); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: var(--bg-tertiary); color: var(--text-secondary); border: 1px solid var(--border-primary); }
    .btn-secondary:hover { background: var(--bg-hover); }

    .success-message { padding: 14px 20px; background: var(--success-bg); border: 1px solid var(--success-border); border-radius: var(--radius-lg); color: var(--success-text); font-size: 14px; font-weight: 500; margin-top: 20px; }
    .error-message { padding: 14px 20px; background: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-lg); color: var(--danger-text); font-size: 14px; font-weight: 500; margin-top: 20px; }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .detail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SolicitudesDetailComponent implements OnInit {
  solicitudId: string = '';
  solicitud: any = null;

  // Form
  solicitante = '';
  observaciones = '';
  selectedItems: { articulo: string; lote: string; cantidad: number; disponible: number; ingresoId: number; ingresoDetalleId: number }[] = [];
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Articles
  availableArticles: AvailableArticle[] = [];
  filteredArticles: AvailableArticle[] = [];
  loadingArticles = false;
  searchTerm = '';

  // Client
  allClientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  selectedCliente: Cliente | null = null;
  clienteSearch = '';
  showClientDropdown = false;
  showNewClientForm = false;
  newClient: Partial<Cliente> = {};

  constructor(
    private solicitudService: SolicitudService,
    private authService: AuthService,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.solicitudId = this.route.snapshot.paramMap.get('id') || '';
    if (this.solicitudId) {
      this.loadSolicitud();
    } else {
      this.loadAvailableArticles();
      this.loadClientes();
      const user = this.authService.getUser();
      if (user) {
        this.solicitante = user.name || '';
      }
    }

    document.addEventListener('click', (e: any) => {
      if (!e.target.closest('.client-selector')) {
        this.showClientDropdown = false;
      }
    });
  }

  loadClientes() {
    const companyId = this.authService.getCompanyId();
    this.clienteService.findAll(companyId).subscribe({
      next: (data) => { this.allClientes = data; this.filteredClientes = data; },
      error: () => {}
    });
  }

  onClienteSearch() {
    const term = this.clienteSearch.toLowerCase().trim();
    if (!term) { this.filteredClientes = this.allClientes; return; }
    this.filteredClientes = this.allClientes.filter(c =>
      (c.nombre && c.nombre.toLowerCase().includes(term)) ||
      (c.rif && c.rif.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term))
    );
    this.showClientDropdown = true;
  }

  selectCliente(cliente: Cliente) {
    this.selectedCliente = cliente;
    this.solicitante = cliente.nombre;
    this.clienteSearch = '';
    this.showClientDropdown = false;
  }

  clearCliente() {
    this.selectedCliente = null;
    this.solicitante = '';
  }

  createAndSelectClient() {
    if (!this.newClient.nombre?.trim()) return;
    const companyId = this.authService.getCompanyId();
    const userId = this.authService.getUser()?.id;
    this.clienteService.create({ ...this.newClient, companyId, userId } as Cliente).subscribe({
      next: (created) => {
        this.allClientes.push(created);
        this.selectCliente(created);
        this.newClient = {};
        this.showNewClientForm = false;
        this.successMessage = 'Cliente creado';
        setTimeout(() => this.successMessage = '', 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear cliente';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  loadSolicitud() {
    this.solicitudService.findOne(parseInt(this.solicitudId)).subscribe({
      next: (data) => this.solicitud = data,
      error: () => this.errorMessage = 'Error al cargar la solicitud'
    });
  }

  loadAvailableArticles() {
    this.loadingArticles = true;
    const companyId = this.authService.getCompanyId();
    this.solicitudService.getAvailableArticles(companyId).subscribe({
      next: (articles) => {
        this.availableArticles = articles;
        this.filteredArticles = articles;
        this.loadingArticles = false;
      },
      error: () => {
        this.loadingArticles = false;
        this.errorMessage = 'Error al cargar artículos disponibles';
      }
    });
  }

  filterArticles() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredArticles = this.availableArticles;
      return;
    }
    this.filteredArticles = this.availableArticles.filter(a =>
      a.articulo.toLowerCase().includes(term) ||
      a.lote.toLowerCase().includes(term) ||
      a.ingresoCorrelativo.toLowerCase().includes(term)
    );
  }

  isArticleSelected(art: AvailableArticle): boolean {
    return this.selectedItems.some(s => s.ingresoDetalleId === art.id);
  }

  addArticle(art: AvailableArticle) {
    if (this.isArticleSelected(art)) return;
    this.selectedItems.push({
      articulo: art.articulo,
      lote: art.lote,
      cantidad: 1,
      disponible: art.disponible,
      ingresoId: art.ingreso_id,
      ingresoDetalleId: art.id
    });
  }

  removeItem(index: number) {
    this.selectedItems.splice(index, 1);
  }

  validateQty(item: { cantidad: number; disponible: number }) {
    if (item.cantidad > item.disponible) {
      alert(`La cantidad máxima disponible es ${item.disponible}. Se ajustará al máximo.`);
      item.cantidad = item.disponible;
    }
    if (item.cantidad < 1) {
      item.cantidad = 1;
    }
  }

  clearSelection() {
    this.selectedItems = [];
  }

  get canSubmit(): boolean {
    return this.solicitante.trim().length > 0 && this.selectedItems.length > 0 && this.selectedItems.every(i => i.cantidad > 0 && i.cantidad <= i.disponible);
  }

  getEstadoLabel(estado: string): string {
    const labels: any = { pendiente: 'Pendiente', aprobado: 'Aprobado', rechazado: 'Rechazado', completado: 'Completado' };
    return labels[estado] || estado;
  }

  getDetalleEstado(det: SolicitudDetalle): string {
    if (det.cantidadEntregada === 0) return 'Pendiente';
    if (det.cantidadEntregada >= det.cantidadSolicitada) return 'Entregado';
    return 'Parcial';
  }

  submitSolicitud() {
    if (!this.canSubmit || this.isSubmitting) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const user = this.authService.getUser();
    const companyId = this.authService.getCompanyId();

    const payload = {
      solicitante: this.solicitante.trim(),
      userId: user?.id,
      companyId: companyId,
      clienteId: this.selectedCliente?.id || null,
      observaciones: this.observaciones.trim() || undefined,
      detalles: this.selectedItems.map(item => ({
        articulo: item.articulo,
        cantidadSolicitada: item.cantidad
      }))
    };

    this.solicitudService.create(payload).subscribe({
      next: (result) => {
        this.successMessage = `Solicitud ${result.solicitud.correlativo} creada exitosamente`;
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/inventory/solicitudes', result.solicitud.id]);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear la solicitud';
        this.isSubmitting = false;
      }
    });
  }
}
