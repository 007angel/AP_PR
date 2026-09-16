import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArticuloService } from '../../../services/articulo.service';
import { AuthService } from '../../../services/auth.service';
import { Articulo } from '../../../models/articulo.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmService } from '../../../shared/confirm-dialog/confirm.service';

@Component({
  selector: 'app-articulo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
  template: `
    <div class="page-container">
      <app-confirm-dialog></app-confirm-dialog>
      <div class="page-header">
        <div class="header-content">
          <h1>Artículos</h1>
          <p>Gestión de productos e insumos</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="showForm = !showForm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {{ showForm ? 'Cancelar' : 'Nuevo Artículo' }}
          </button>
        </div>
      </div>

      <!-- Formulario inline -->
      <div class="form-card" *ngIf="showForm">
        <h3>{{ editingId ? 'Editar Artículo' : 'Nuevo Artículo' }}</h3>
        <div class="form-layout">
          <!-- Sección foto -->
          <div class="foto-section">
            <div class="foto-preview" (click)="fotoInput.click()">
              <img *ngIf="form.foto" [src]="form.foto" alt="Foto del artículo" class="foto-img" />
              <div *ngIf="!form.foto" class="foto-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Click para subir foto</span>
              </div>
            </div>
            <input #fotoInput type="file" accept="image/*" (change)="onFotoSelected($event)" class="hidden-input" />
            <button *ngIf="form.foto" class="btn-remove-foto" (click)="removeFoto()">Quitar foto</button>
          </div>

          <!-- Campos del formulario -->
          <div class="form-fields">
            <div class="form-grid">
              <div class="form-group">
                <label>Código / SKU</label>
                <input type="text" [(ngModel)]="form.codigo" placeholder="ART-001" class="form-input" />
              </div>
              <div class="form-group">
                <label>Nombre *</label>
                <input type="text" [(ngModel)]="form.nombre" placeholder="Nombre del artículo" class="form-input" />
              </div>
              <div class="form-group">
                <label>Unidad</label>
                <select [(ngModel)]="form.unidad" class="form-input">
                  <option value="UNIDAD">Unidad</option>
                  <option value="KILOGRAMO">Kilogramo</option>
                  <option value="GRAMO">Gramo</option>
                  <option value="LITRO">Litro</option>
                  <option value="MILILITRO">Mililitro</option>
                  <option value="METRO">Metro</option>
                  <option value="CAJA">Caja</option>
                  <option value="PAQUETE">Paquete</option>
                  <option value="PAR">Par</option>
                  <option value="DOCENA">Docena</option>
                </select>
              </div>
              <div class="form-group">
                <label>Precio</label>
                <input type="number" [(ngModel)]="form.precio" placeholder="0.00" min="0" step="0.01" class="form-input" />
              </div>
              <div class="form-group full-width">
                <label>Descripción</label>
                <textarea [(ngModel)]="form.descripcion" placeholder="Descripción del artículo" class="form-input" rows="2"></textarea>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn-secondary" (click)="cancelEdit()">Cancelar</button>
              <button class="btn-primary" (click)="saveArticulo()" [disabled]="!form.nombre?.trim()">
                {{ editingId ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </div>
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
        <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Buscar por nombre, código o descripción..." class="search-input" />
      </div>

      <!-- Grid de artículos -->
      <div class="articulos-grid">
        <div *ngIf="articulos.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          <p>No hay artículos registrados</p>
        </div>
        <div *ngFor="let a of articulos" class="articulo-card">
          <div class="articulo-foto">
            <img *ngIf="a.foto" [src]="a.foto" [alt]="a.nombre" />
            <div *ngIf="!a.foto" class="no-foto">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          </div>
          <div class="articulo-info">
            <div class="articulo-header">
              <span class="articulo-codigo" *ngIf="a.codigo">{{ a.codigo }}</span>
              <span class="articulo-unidad">{{ a.unidad || 'UNIDAD' }}</span>
            </div>
            <h4>{{ a.nombre }}</h4>
            <p class="articulo-desc" *ngIf="a.descripcion">{{ a.descripcion }}</p>
            <div class="articulo-footer">
              <span class="articulo-precio" *ngIf="a.precio">{{ a.precio | number:'1.2-2' }}</span>
              <span class="articulo-precio" *ngIf="!a.precio">Sin precio</span>
              <div class="articulo-actions">
                <button class="btn-icon" (click)="editArticulo(a)" title="Editar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button class="btn-icon btn-danger" (click)="deleteArticulo(a.id!)" title="Eliminar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
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
    .btn-secondary { padding: 10px 18px; font-size: 13px; font-weight: 600; color: var(--text-secondary); background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); cursor: pointer; }
    .btn-secondary:hover { background: var(--bg-hover); }

    /* Form Card */
    .form-card { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; }
    .form-card h3 { margin: 0 0 20px; font-size: 16px; font-weight: 600; color: var(--text-primary); }
    .form-layout { display: flex; gap: 24px; }
    .form-fields { flex: 1; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .full-width { grid-column: 1 / -1; }
    .form-group { display: flex; flex-direction: column; }
    .form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; }
    .form-input { padding: 10px 14px; font-size: 14px; border: 1px solid var(--border-primary); border-radius: var(--radius-md); background: var(--bg-primary); color: var(--text-primary); outline: none; transition: var(--transition); box-sizing: border-box; }
    .form-input:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    textarea.form-input { resize: vertical; font-family: inherit; }
    select.form-input { cursor: pointer; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-primary); }

    /* Foto Section */
    .foto-section { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .foto-preview { width: 160px; height: 160px; border: 2px dashed var(--border-primary); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
    .foto-preview:hover { border-color: var(--accent-primary); }
    .foto-img { width: 100%; height: 100%; object-fit: cover; }
    .foto-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--text-muted); }
    .foto-placeholder span { font-size: 11px; text-align: center; }
    .hidden-input { display: none; }
    .btn-remove-foto { padding: 6px 12px; font-size: 12px; font-weight: 500; color: var(--danger-text); background: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-md); cursor: pointer; }
    .btn-remove-foto:hover { background: var(--danger); color: white; }

    /* Search & Messages */
    .search-bar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-md); margin-bottom: 20px; color: var(--text-muted); }
    .search-input { flex: 1; border: none; background: transparent; font-size: 14px; color: var(--text-primary); outline: none; }
    .search-input::placeholder { color: var(--text-muted); }
    .success-message { padding: 14px 20px; background: var(--success-bg); border: 1px solid var(--success-border); border-radius: var(--radius-lg); color: var(--success-text); font-size: 14px; font-weight: 500; margin-bottom: 20px; }
    .error-message { padding: 14px 20px; background: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-lg); color: var(--danger-text); font-size: 14px; font-weight: 500; margin-bottom: 20px; }

    /* Articulos Grid */
    .articulos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .articulo-card { background: var(--bg-secondary); border: 1px solid var(--border-primary); border-radius: var(--radius-lg); overflow: hidden; transition: var(--transition); }
    .articulo-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .articulo-foto { width: 100%; height: 180px; overflow: hidden; background: var(--bg-tertiary); }
    .articulo-foto img { width: 100%; height: 100%; object-fit: cover; }
    .no-foto { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
    .articulo-info { padding: 16px; }
    .articulo-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .articulo-codigo { font-size: 12px; font-weight: 600; color: var(--accent-primary); background: var(--accent-bg); padding: 2px 8px; border-radius: 10px; }
    .articulo-unidad { font-size: 11px; color: var(--text-muted); background: var(--bg-tertiary); padding: 2px 8px; border-radius: 10px; }
    .articulo-info h4 { margin: 0 0 6px; font-size: 15px; font-weight: 600; color: var(--text-primary); }
    .articulo-desc { font-size: 13px; color: var(--text-tertiary); margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .articulo-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid var(--border-primary); }
    .articulo-precio { font-size: 16px; font-weight: 700; color: var(--success-text); }
    .articulo-actions { display: flex; gap: 4px; }
    .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-primary); border-radius: 6px; background: var(--bg-primary); color: var(--text-secondary); cursor: pointer; transition: var(--transition); }
    .btn-icon:hover { background: var(--accent-bg); color: var(--accent-primary); border-color: var(--accent-border); }
    .btn-icon.btn-danger { color: var(--danger-text); }
    .btn-icon.btn-danger:hover { background: var(--danger-bg); border-color: var(--danger-border); }

    .empty-state { grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--text-tertiary); }
    .empty-state p { margin-top: 12px; font-size: 14px; }

    @media (max-width: 768px) {
      .form-layout { flex-direction: column; }
      .form-grid { grid-template-columns: 1fr; }
      .articulos-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ArticuloListComponent implements OnInit {
  articulos: Articulo[] = [];
  allArticulos: Articulo[] = [];
  showForm = false;
  editingId: number | null = null;
  searchTerm = '';
  successMessage = '';
  errorMessage = '';

  form: Partial<Articulo> = this.getEmptyForm();

  constructor(
    private articuloService: ArticuloService,
    private authService: AuthService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.loadArticulos();
  }

  getEmptyForm(): Partial<Articulo> {
    return { codigo: '', nombre: '', descripcion: '', unidad: 'UNIDAD', precio: 0, foto: '' };
  }

  loadArticulos() {
    const companyId = this.authService.getCompanyId();
    this.articuloService.findAll(companyId).subscribe({
      next: (data) => { this.allArticulos = data; this.articulos = data; },
      error: () => this.errorMessage = 'Error al cargar artículos'
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) { this.articulos = this.allArticulos; return; }
    this.articulos = this.allArticulos.filter(a =>
      (a.nombre && a.nombre.toLowerCase().includes(term)) ||
      (a.codigo && a.codigo.toLowerCase().includes(term)) ||
      (a.descripcion && a.descripcion.toLowerCase().includes(term))
    );
  }

  onFotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'La foto no debe superar 2MB';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.form.foto = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeFoto() {
    this.form.foto = '';
  }

  editArticulo(articulo: Articulo) {
    this.editingId = articulo.id!;
    this.form = { ...articulo };
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.showForm = false;
    this.editingId = null;
    this.form = this.getEmptyForm();
  }

  saveArticulo() {
    if (!this.form.nombre?.trim()) return;
    const companyId = this.authService.getCompanyId();
    const userId = this.authService.getUser()?.id;
    const payload = { ...this.form, companyId, userId };

    const req = this.editingId
      ? this.articuloService.update(this.editingId, payload)
      : this.articuloService.create(payload as Articulo);

    req.subscribe({
      next: () => {
        this.successMessage = this.editingId ? 'Artículo actualizado' : 'Artículo creado';
        this.cancelEdit();
        this.loadArticulos();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al guardar';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  deleteArticulo(id: number) {
    this.confirmService.confirm({
      title: 'Eliminar artículo',
      message: '¿Está seguro de eliminar este artículo?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).subscribe(ok => {
      if (!ok) return;
      this.articuloService.delete(id).subscribe({
        next: () => {
          this.successMessage = 'Artículo eliminado';
          this.loadArticulos();
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
