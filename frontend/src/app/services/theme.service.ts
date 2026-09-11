import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageKey = 'theme';
  private isDarkSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    this.applyTheme(this.isDarkSubject.value);
  }

  private getInitialTheme(): boolean {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggleTheme(): void {
    const newValue = !this.isDarkSubject.value;
    this.isDarkSubject.next(newValue);
    localStorage.setItem(this.storageKey, newValue ? 'dark' : 'light');
    this.applyTheme(newValue);
  }

  isDark(): boolean {
    return this.isDarkSubject.value;
  }

  setDark(dark: boolean): void {
    this.isDarkSubject.next(dark);
    localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
    this.applyTheme(dark);
  }
}
