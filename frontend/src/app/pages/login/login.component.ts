import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };
  rememberMe = false;
  isLoading = false;
  errorMessage = '';
  errorType: '' | 'email' | 'password' = '';
  showExpiredMessage = false;

  formErrors: { [key: string]: string } = {};

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  checkExpired() {
    if (this.authService.isTrialExpired()) {
      this.showExpiredMessage = true;
    }
  }

  onSubmit() {
    this.formErrors = {};
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.errorType = '';
    this.showExpiredMessage = false;

    this.userService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (user) => {
        this.authService.login(user);
        if (this.authService.isTrialExpired()) {
          this.showExpiredMessage = true;
          this.isLoading = false;
          return;
        }
        this.redirectByRole(user.role);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Credenciales inválidas';
        if (this.errorMessage.includes('correo')) {
          this.errorType = 'email';
        } else if (this.errorMessage.includes('contraseña')) {
          this.errorType = 'password';
        } else {
          this.errorType = '';
        }
        this.isLoading = false;
      }
    });
  }

  redirectByRole(role: string) {
    switch (role) {
      case 'master':
      case 'admin':
        this.router.navigate(['/dashboard']);
        break;
      case 'user':
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }

  contactSales() {
    window.open('https://wa.me/525512345678?text=Hola,%20necesito%20información%20sobre%20TechSolutions', '_blank');
  }

  validateForm(): boolean {
    let valid = true;
    
    if (!this.credentials.email) {
      this.formErrors['email'] = 'El correo electrónico es requerido';
      valid = false;
    }
    if (!this.credentials.password) {
      this.formErrors['password'] = 'La contraseña es requerida';
      valid = false;
    }
    
    return valid;
  }
}
