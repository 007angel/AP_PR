import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmService, DialogState } from './confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="confirmService.dialog$ | async as dialog" class="confirm-overlay" (click)="onCancel(dialog)">
      <div class="confirm-card" (click)="$event.stopPropagation()">
        <div class="confirm-icon" [class.danger]="isDanger(dialog)">
          <svg *ngIf="isDanger(dialog)" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <svg *ngIf="!isDanger(dialog)" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9 12l2 2 4-4"></path>
          </svg>
        </div>
        <h3>{{ dialog.title }}</h3>
        <p>{{ dialog.message }}</p>
        <div class="prompt-input" *ngIf="dialog.mode === 'prompt'">
          <label *ngIf="dialog.inputLabel">{{ dialog.inputLabel }}</label>
          <textarea
            rows="3"
            [placeholder]="dialog.inputPlaceholder || ''"
            [(ngModel)]="dialog.inputValue"
          ></textarea>
          <span class="input-error" *ngIf="dialog.inputError">{{ dialog.inputError }}</span>
        </div>
        <div class="confirm-actions">
          <button type="button" class="btn-cancel" (click)="onCancel(dialog)">
            {{ dialog.cancelText }}
          </button>
          <button
            type="button"
            class="btn-confirm"
            [class.danger]="isDanger(dialog)"
            (click)="onConfirm(dialog)"
          >
            {{ dialog.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
      animation: fadeIn 0.15s ease-out;
    }

    .confirm-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: 28px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
      animation: popIn 0.18s ease-out;

      h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
      }

      p {
        margin: 0 0 24px 0;
        font-size: 14px;
        color: var(--text-secondary);
        line-height: 1.5;
      }
    }

    .confirm-icon {
      width: 56px;
      height: 56px;
      margin: 0 auto 16px auto;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--accent-bg);
      color: var(--accent-primary);

      &.danger {
        background: var(--danger-bg);
        color: var(--danger-text);
      }
    }

    .prompt-input {
      text-align: left;
      margin: -8px 0 20px 0;
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
      }

      textarea {
        padding: 10px 14px;
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-md);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
      }

      .input-error {
        font-size: 12px;
        color: var(--danger-text);
      }
    }

    .confirm-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .btn-cancel {
      padding: 10px 20px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-primary);
      background: transparent;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }
    }

    .btn-confirm {
      padding: 10px 20px;
      border-radius: var(--radius-md);
      border: none;
      background: var(--accent-primary);
      color: white;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background: var(--accent-hover);
      }

      &.danger {
        background: var(--danger, #dc2626);
        color: white;

        &:hover {
          filter: brightness(0.9);
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes popIn {
      from { opacity: 0; transform: scale(0.95) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(public confirmService: ConfirmService) {}

  isDanger(dialog: DialogState): boolean {
    return dialog.mode === 'confirm' ? !!dialog.danger : true;
  }

  onConfirm(dialog: DialogState) {
    if (dialog.mode === 'prompt') {
      const value = (dialog.inputValue || '').trim();
      if (dialog.required && !value) {
        this.confirmService.setInputError('Este campo es requerido');
        return;
      }
      this.confirmService.resolvePrompt(value || null);
    } else {
      this.confirmService.resolve(true);
    }
  }

  onCancel(dialog: DialogState) {
    if (dialog.mode === 'prompt') {
      this.confirmService.resolvePrompt(null);
    } else {
      this.confirmService.resolve(false);
    }
  }
}
