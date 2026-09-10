import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TRIAL_DAYS = 14;

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  login(user: any): void {
    const loginData = {
      ...user,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(loginData));
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isTrialExpired(): boolean {
    const user = this.getUser();
    if (!user || !user.loginAt) return false;
    const loginDate = new Date(user.loginAt);
    const now = new Date();
    const diffMs = now.getTime() - loginDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= this.TRIAL_DAYS;
  }

  getRemainingDays(): number {
    const user = this.getUser();
    if (!user || !user.loginAt) return this.TRIAL_DAYS;
    const loginDate = new Date(user.loginAt);
    const now = new Date();
    const diffMs = now.getTime() - loginDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, this.TRIAL_DAYS - diffDays);
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || 'user';
  }

  isMaster(): boolean {
    return this.getRole() === 'master';
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isUser(): boolean {
    return this.getRole() === 'user';
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.getRole());
  }

  hasModule(moduleName: string): boolean {
    const user = this.getUser();
    return user?.modules?.includes(moduleName) || false;
  }

  hasAnyModule(moduleNames: string[]): boolean {
    const user = this.getUser();
    if (!user?.modules) return false;
    return moduleNames.some(m => user.modules.includes(m));
  }
}
