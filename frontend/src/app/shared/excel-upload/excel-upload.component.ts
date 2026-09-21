import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngresoExcelService } from '../../services/ingreso-excel.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-excel-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="upload-overlay" *ngIf="visible" (click)="close()">
      <div class="upload-modal" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-left">
            <div class="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <polyline points="9 15 12 12 15 15"></polyline>
              </svg>
            </div>
            <div>
              <h3>Importar Ingreso desde Excel</h3>
              <p class="subtitle">Sube un archivo .xlsx con el encabezado y las líneas</p>
            </div>
          </div>
          <button class="close-btn" (click)="close()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Steps -->
          <div class="steps">
            <div class="step" [class.active]="step === 1" [class.done]="step > 1">
              <span class="step-num">1</span>
              Descargar plantilla
            </div>
            <div class="step-divider"></div>
            <div class="step" [class.active]="step === 2">
              <span class="step-num">2</span>
              Subir archivo
            </div>
          </div>

          <!-- Step 1: Download template -->
          <div class="step-content" *ngIf="step === 1">
            <div class="template-card">
              <div class="template-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <h4>Plantilla de Ingreso</h4>
              <p>Descarga la plantilla, completa los datos del encabezado y las líneas, luego súbela aquí.</p>
              <div class="template-info">
                <div class="info-item">
                  <span class="info-label">Hoja "Encabezado":</span>
                  <span>Número factura, fecha, tarimas, proveedor</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Hoja "Líneas":</span>
                  <span>Lote, artículo, tarima, caja, unidad, costo</span>
                </div>
              </div>
              <button class="btn-download" (click)="downloadTemplate()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Descargar Plantilla Excel
              </button>
            </div>
            <div class="step-actions">
              <button class="btn-primary" (click)="step = 2">Siguiente: Subir Archivo</button>
            </div>
          </div>

          <!-- Step 2: Upload file -->
          <div class="step-content" *ngIf="step === 2">
            <!-- Drop zone -->
            <div
              class="drop-zone"
              [class.has-file]="selectedFile"
              [class.dragging]="isDragging"
              (dragover)="onDragOver($event)"
              (dragleave)="isDragging = false"
              (drop)="onDrop($event)"
              (click)="fileInput.click()"
            >
              <input
                #fileInput
                type="file"
                accept=".xlsx,.xls"
                (change)="onFileSelected($event)"
                style="display: none"
              />

              <div *ngIf="!selectedFile" class="drop-content">
                <div class="drop-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <p class="drop-text">Arrastra el archivo aquí o <span class="browse-link">busca</span></p>
                <p class="drop-hint">Solo archivos .xlsx o .xls (máx. 5 MB)</p>
              </div>

              <div *ngIf="selectedFile" class="file-info">
                <div class="file-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div class="file-details">
                  <span class="file-name">{{ selectedFile.name }}</span>
                  <span class="file-size">{{ formatSize(selectedFile.size) }}</span>
                </div>
                <button class="remove-file" (click)="removeFile($event)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Progress -->
            <div class="upload-progress" *ngIf="isUploading">
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              <span class="progress-text">Procesando archivo...</span>
            </div>

            <!-- Result -->
            <div class="upload-result" *ngIf="uploadResult">
              <div class="result-icon" [class.success]="!uploadResult.errores" [class.warning]="uploadResult.errores">
                <svg *ngIf="!uploadResult.errores" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <svg *ngIf="uploadResult.errores" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div class="result-info">
                <p class="result-msg">{{ uploadResult.message }}</p>
                <p class="result-detail" *ngIf="uploadResult.ingreso">
                  Correlativo: <strong>{{ uploadResult.ingreso.correlativo }}</strong>
                  &middot; Líneas: <strong>{{ uploadResult.detalles?.length || 0 }}</strong>
                </p>
              </div>
              <div class="result-errors" *ngIf="uploadResult.errores">
                <div class="error-item" *ngFor="let err of uploadResult.errores">
                  {{ err }}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="step-actions">
              <button class="btn-secondary" (click)="step = 1" [disabled]="isUploading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Volver
              </button>
              <button
                class="btn-primary"
                (click)="uploadFile()"
                [disabled]="!selectedFile || isUploading || !!uploadResult"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                {{ isUploading ? 'Procesando...' : 'Subir Archivo' }}
              </button>
              <button
                class="btn-success"
                *ngIf="uploadResult && !uploadResult.errores"
                (click)="close()"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .upload-modal {
      background: var(--bg-secondary, #ffffff);
      border-radius: 16px;
      width: 560px;
      max-width: 95vw;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;
      border-bottom: 1px solid var(--border-primary, #e2e8f0);

      .header-left {
        display: flex;
        align-items: center;
        gap: 14px;

        .header-icon {
          width: 40px;
          height: 40px;
          background: var(--accent-light, #eff6ff);
          color: var(--accent-primary, #2563eb);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary, #0f172a);
        }

        .subtitle {
          margin: 2px 0 0;
          font-size: 12px;
          color: var(--text-muted, #94a3b8);
        }
      }

      .close-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: var(--bg-tertiary, #f1f5f9);
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary, #64748b);
        transition: all 0.2s;

        &:hover {
          background: var(--bg-quaternary, #e2e8f0);
          color: var(--text-primary, #0f172a);
        }
      }
    }

    .modal-body {
      padding: 24px;
      max-height: calc(90vh - 80px);
      overflow-y: auto;
    }

    /* Steps */
    .steps {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 28px;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted, #94a3b8);
      padding: 8px 16px;
      border-radius: 20px;
      transition: all 0.2s;

      &.active {
        color: var(--accent-primary, #2563eb);
        background: var(--accent-light, #eff6ff);
      }

      &.done {
        color: var(--success, #10b981);
      }

      .step-num {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        background: var(--bg-tertiary, #f1f5f9);
        color: var(--text-muted, #94a3b8);
      }

      &.active .step-num {
        background: var(--accent-primary, #2563eb);
        color: white;
      }

      &.done .step-num {
        background: var(--success, #10b981);
        color: white;
      }
    }

    .step-divider {
      width: 32px;
      height: 2px;
      background: var(--border-primary, #e2e8f0);
      margin: 0 4px;
    }

    /* Template Card */
    .template-card {
      text-align: center;
      padding: 28px 20px;
      border: 2px dashed var(--border-primary, #e2e8f0);
      border-radius: 14px;
      background: var(--bg-primary, #f8fafc);
      margin-bottom: 24px;

      .template-icon {
        width: 64px;
        height: 64px;
        background: var(--accent-light, #eff6ff);
        color: var(--accent-primary, #2563eb);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
      }

      h4 {
        margin: 0 0 8px;
        font-size: 16px;
        color: var(--text-primary, #0f172a);
      }

      p {
        margin: 0 0 16px;
        font-size: 13px;
        color: var(--text-secondary, #64748b);
      }
    }

    .template-info {
      text-align: left;
      max-width: 380px;
      margin: 0 auto 20px;

      .info-item {
        display: flex;
        gap: 8px;
        padding: 8px 12px;
        background: var(--bg-secondary, #ffffff);
        border-radius: 8px;
        margin-bottom: 6px;
        font-size: 12px;
        color: var(--text-secondary, #64748b);

        .info-label {
          font-weight: 600;
          color: var(--text-primary, #0f172a);
          white-space: nowrap;
        }
      }
    }

    .btn-download {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--accent-primary, #2563eb);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--accent-hover, #1d4ed8);
        transform: translateY(-1px);
      }
    }

    /* Drop Zone */
    .drop-zone {
      border: 2px dashed var(--border-primary, #e2e8f0);
      border-radius: 14px;
      padding: 32px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 20px;

      &:hover {
        border-color: var(--accent-primary, #2563eb);
        background: var(--accent-light, #eff6ff);
      }

      &.dragging {
        border-color: var(--accent-primary, #2563eb);
        background: var(--accent-light, #eff6ff);
      }

      &.has-file {
        border-style: solid;
        border-color: var(--success, #10b981);
        background: rgba(16, 185, 129, 0.04);
        padding: 16px 20px;
      }
    }

    .drop-content {
      .drop-icon {
        color: var(--text-muted, #94a3b8);
        margin-bottom: 12px;
      }

      .drop-text {
        font-size: 14px;
        color: var(--text-secondary, #64748b);
        margin: 0 0 6px;

        .browse-link {
          color: var(--accent-primary, #2563eb);
          font-weight: 600;
        }
      }

      .drop-hint {
        font-size: 12px;
        color: var(--text-muted, #94a3b8);
        margin: 0;
      }
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 14px;

      .file-icon {
        color: var(--success, #10b981);
      }

      .file-details {
        flex: 1;
        text-align: left;

        .file-name {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary, #0f172a);
        }

        .file-size {
          font-size: 12px;
          color: var(--text-muted, #94a3b8);
        }
      }

      .remove-file {
        width: 28px;
        height: 28px;
        border: none;
        background: var(--bg-tertiary, #f1f5f9);
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted, #94a3b8);
        transition: all 0.2s;

        &:hover {
          background: #fee2e2;
          color: #ef4444;
        }
      }
    }

    /* Progress */
    .upload-progress {
      margin-bottom: 16px;

      .progress-bar {
        height: 6px;
        background: var(--bg-tertiary, #f1f5f9);
        border-radius: 3px;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          width: 60%;
          background: var(--accent-primary, #2563eb);
          border-radius: 3px;
          animation: progress-anim 1.5s ease-in-out infinite;
        }
      }

      .progress-text {
        display: block;
        text-align: center;
        font-size: 12px;
        color: var(--text-muted, #94a3b8);
        margin-top: 8px;
      }
    }

    @keyframes progress-anim {
      0% { width: 20%; }
      50% { width: 80%; }
      100% { width: 20%; }
    }

    /* Result */
    .upload-result {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 20px;

      .result-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &.success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success, #10b981);
        }

        &.warning {
          background: rgba(245, 158, 11, 0.1);
          color: var(--warning, #f59e0b);
        }
      }

      .result-info {
        .result-msg {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary, #0f172a);
        }

        .result-detail {
          margin: 0;
          font-size: 13px;
          color: var(--text-secondary, #64748b);

          strong {
            color: var(--accent-primary, #2563eb);
          }
        }
      }

      .result-errors {
        max-height: 120px;
        overflow-y: auto;
        padding: 10px 12px;
        background: #fef2f2;
        border-radius: 8px;
        border: 1px solid #fecaca;

        .error-item {
          font-size: 12px;
          color: #991b1b;
          padding: 3px 0;
          border-bottom: 1px solid #fecaca;

          &:last-child { border-bottom: none; }
        }
      }
    }

    /* Actions */
    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 16px;
      border-top: 1px solid var(--border-primary, #e2e8f0);
    }

    .btn-primary, .btn-secondary, .btn-success {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: var(--accent-primary, #2563eb);
      color: white;

      &:hover:not(:disabled) {
        background: var(--accent-hover, #1d4ed8);
      }
    }

    .btn-secondary {
      background: var(--bg-tertiary, #f1f5f9);
      color: var(--text-secondary, #64748b);

      &:hover:not(:disabled) {
        background: var(--bg-quaternary, #e2e8f0);
      }
    }

    .btn-success {
      background: var(--success, #10b981);
      color: white;

      &:hover:not(:disabled) {
        background: #059669;
      }
    }
  `]
})
export class ExcelUploadComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() uploaded = new EventEmitter<any>();

  visible = false;
  step = 1;
  selectedFile: File | null = null;
  isDragging = false;
  isUploading = false;
  uploadResult: any = null;
  companyId: number = 0;

  constructor(
    private excelService: IngresoExcelService,
    private authService: AuthService
  ) {}

  open() {
    this.visible = true;
    this.step = 1;
    this.selectedFile = null;
    this.isUploading = false;
    this.uploadResult = null;
    const user = this.authService.getUser();
    this.companyId = user?.companyId || 0;
  }

  close() {
    this.visible = false;
    this.closed.emit();
  }

  async downloadTemplate() {
    this.excelService.downloadTemplate(this.companyId);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  validateAndSetFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      alert('Solo se permiten archivos .xlsx o .xls');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo excede el tamaño máximo de 5 MB');
      return;
    }
    this.selectedFile = file;
    this.uploadResult = null;
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.uploadResult = null;
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  uploadFile() {
    if (!this.selectedFile || this.isUploading) return;

    this.isUploading = true;
    const user = this.authService.getUser();
    this.excelService.uploadExcel(this.selectedFile, this.companyId, user?.id, user?.role).subscribe({
      next: (result) => {
        this.isUploading = false;
        this.uploadResult = result;
        if (!result.errores) {
          this.uploaded.emit(result);
        }
      },
      error: (err) => {
        this.isUploading = false;
        const msg = err.error?.message || err.message || 'Error al procesar el archivo';
        this.uploadResult = {
          message: msg,
          errores: [msg]
        };
      }
    });
  }
}
