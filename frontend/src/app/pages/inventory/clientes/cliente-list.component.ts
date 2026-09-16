import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';
import { Cliente } from '../../../models/cliente.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../../../shared/confirm-dialog/confirm.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <app-confirm-dialog></app-confirm-dialog>
      <div class="page-header">
        <div class="header-content">
          <h1>Clientes</h1>
          <p>Formulario de clientes</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="showForm = !showForm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {{ showForm ? 'Cancelar' : 'Nuevo Cliente' }}
          </button>
        </div>
      </div>

      <!-- Formulario inline -->
      <div class="form-card" *ngIf="showForm">
        <h3>{{ editingId ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre / Razón Social *</label>
            <input type="text" [(ngModel)]="form.nombre" placeholder="Nombre del cliente" class="form-input" />
          </div>
          <div class="form-group">
            <label>RIF / Cédula</label>
            <input type="text" [(ngModel)]="form.rif" placeholder="J-12345678-9" class="form-input" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="form.email" placeholder="correo@ejemplo.com" class="form-input" />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input type="text" [(ngModel)]="form.telefono" placeholder="+58 412 1234567" class="form-input" />
          </div>
          <div class="form-group">
            <label>Contacto</label>
            <input type="text" [(ngModel)]="form.contacto" placeholder="Persona de contacto" class="form-input" />
          </div>
          <div class="form-group">
            <label>Dirección</label>
            <input type="text" [(ngModel)]="form.direccion" placeholder="Dirección completa" class="form-input" />
          </div>
          <div class="form-group full-width">
            <label>Observaciones</label>
            <textarea [(ngModel)]="form.observaciones" placeholder="Notas adicionales" class="form-input" rows="2"></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-secondary" (click)="cancelEdit()">Cancelar</button>
          <button class="btn-primary" (click)="saveCliente()" [disabled]="!form.nombre?.trim()">
            {{ editingId ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </div>

      <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <!-- Buscador -->
      <div class="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Buscar por nombre, RIF o email..." class="search-input" />
      </div>

      <!-- Tabla -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RIF</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="clientes.length === 0">
              <td colspan="6" class="empty-row">No hay clientes registrados</td>
            </tr>
            <tr *ngFor="let c of clientes">
              <td><strong>{{ c.nombre }}</strong></td>
              <td>{{ c.rif || '—' }}</td>
              <td>{{ c.email || '—' }}</td>
              <td>{{ c.telefono || '—' }}</td>
              <td>{{ c.contacto || '—' }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-action" (click)="editCliente(c)">Editar</button>
                  <button class="btn-action btn-delete" (click)="deleteCliente(c.id!)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
    .header-content h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
    .header-content p { font-size: 14px; color: var(--text-tertiary); margin: 0; }
    .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600; color: white; background: var(--accent-primary); border: none; border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); }
    .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .form-card { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; }
    .form-card h3 { margin: 0 0 20px; font-size: 16px; font-weight: 600; color: var(--text-primary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .full-width { grid-column: 1 / -1; }
    .form-group { display: flex; flex-direction: column; }
    .form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; }
    .form-input { padding: 10px 14px; font-size: 14px; border: 1px solid var(--border-primary); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); outline: none; transition: var(--transition); box-sizing: border-box; }
    .form-input:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    textarea.form-input { resize: vertical; font-family: inherit; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-primary); }
    .btn-secondary { padding: 10px 18px; font-size: 13px; font-weight: 600; color: var(--text-secondary); background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); cursor: pointer; }
    .btn-secondary:hover { background: var(--bg-hover); }

    .search-bar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); margin-bottom: 20px; color: var(--text-muted); }
    .search-input { flex: 1; border: none; background: transparent; font-size: 14px; color: var(--text-primary); outline: none; }
    .search-input::placeholder { color: var(--text-muted); }

    .success-message { padding: 14px 20px; background: var(--success-bg); border: 1px solid var(--success-border); border-radius: var(--radius-lg); color: var(--success-text); font-size: 14px; font-weight: 500; margin-bottom: 20px; }
    .error-message { padding: 14px 20px; background: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-lg); color: var(--danger-text); font-size: 14px; font-weight: 500; margin-bottom: 20px; }

    .table-container { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; background: var(--bg-tertiary); border-bottom: 1px solid var(--border-primary); }
    .data-table td { padding: 14px 16px; font-size: 14px; color: var(--text-primary); border-bottom: 1px solid var(--border-primary); }
    .data-table tr:last-child td { border-bottom: none; }
    .empty-row { text-align: center; color: var(--text-tertiary); padding: 40px !important; }
    .action-buttons { display: flex; gap: 8px; }
    .btn-action { padding: 6px 12px; font-size: 12px; font-weight: 500; color: var(--accent-primary); background: var(--accent-bg); border: 1px solid var(--accent-border); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition); }
    .btn-action:hover { background: var(--accent-primary); color: white; }
    .btn-delete { color: var(--danger-text); background: var(--danger-bg); border-color: var(--danger-border); }
    .btn-delete:hover { background: var(--danger); color: white; }

    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  allClientes: Cliente[] = [];
  showForm = false;
  editingId: number | null = null;
  searchTerm = '';
  successMessage = '';
  errorMessage = '';

  form: Partial<Cliente> = this.getEmptyForm();

  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.loadClientes();
  }

  getEmptyForm(): Partial<Cliente> {
    return { nombre: '', email: '', telefono: '', direccion: '', rif: '', contacto: '', observaciones: '' };
  }

  loadClientes() {
    const companyId = this.authService.getCompanyId();
    this.clienteService.findAll(companyId).subscribe({
      next: (data) => { this.allClientes = data; this.clientes = data; },
      error: () => this.errorMessage = 'Error al cargar clientes'
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) { this.clientes = this.allClientes; return; }
    this.clientes = this.allClientes.filter(c =>
      (c.nombre && c.nombre.toLowerCase().includes(term)) ||
      (c.rif && c.rif.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term))
    );
  }

  editCliente(cliente: Cliente) {
    this.editingId = cliente.id!;
    this.form = { ...cliente };
    this.showForm = true;
  }

  cancelEdit() {
    this.showForm = false;
    this.editingId = null;
    this.form = this.getEmptyForm();
  }

  saveCliente() {
    if (!this.form.nombre?.trim()) return;
    const companyId = this.authService.getCompanyId();
    const userId = this.authService.getUser()?.id;
    const payload = { ...this.form, companyId, userId };

    const req = this.editingId
      ? this.clienteService.update(this.editingId, payload)
      : this.clienteService.create(payload as Cliente);

    req.subscribe({
      next: () => {
        this.successMessage = this.editingId ? 'Cliente actualizado' : 'Cliente creado';
        this.cancelEdit();
        this.loadClientes();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  deleteCliente(id: number) {
    this.confirmService.confirm({
      title: 'Eliminar cliente',
      message: '¿Está seguro de eliminar este cliente?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).subscribe(ok => {
      if (!ok) return;
      this.clienteService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Cliente eliminado';
          this.loadClientes();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al eliminar';
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    });
  }
}
