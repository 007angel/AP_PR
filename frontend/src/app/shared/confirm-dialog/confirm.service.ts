import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

export interface PromptOptions {
  title?: string;
  message: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  confirmText?: string;
  cancelText?: string;
  required?: boolean;
}

export type DialogState = (ConfirmOptions & {
  open: boolean;
  mode: 'confirm';
}) | (PromptOptions & {
  open: boolean;
  mode: 'prompt';
  inputValue: string;
  inputError: string | null;
});

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private state$ = new BehaviorSubject<DialogState | null>(null);
  private result$ = new Subject<any>();

  readonly dialog$ = this.state$.asObservable();

  confirm(options: ConfirmOptions): Observable<boolean> {
    this.state$.next({
      title: 'Confirmar acción',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      danger: true,
      ...options,
      open: true,
      mode: 'confirm'
    });
    return this.result$.pipe(take(1));
  }

  prompt(options: PromptOptions): Observable<string | null> {
    this.state$.next({
      title: 'Confirmar acción',
      confirmText: 'Enviar',
      cancelText: 'Cancelar',
      required: false,
      ...options,
      open: true,
      mode: 'prompt',
      inputValue: '',
      inputError: null
    });
    return this.result$.pipe(take(1));
  }

  resolve(ok: boolean) {
    this.state$.next(null);
    this.result$.next(ok);
  }

  resolvePrompt(value: string | null) {
    this.state$.next(null);
    this.result$.next(value);
  }

  setInputError(message: string | null) {
    const current = this.state$.value;
    if (current && current.mode === 'prompt') {
      this.state$.next({ ...current, inputError: message });
    }
  }
}
