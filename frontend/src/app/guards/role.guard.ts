import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(allowedRoles: string[]): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.authService.isTrialExpired()) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.authService.getUser();
    if (!user || !allowedRoles.includes(user.role)) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
