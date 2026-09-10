import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  totalUsers = 0;
  activeUsers = 0;
  inactiveUsers = 0;
  suspendedUsers = 0;
  trialUsers = 0;
  recentUsers: User[] = [];
  isLoading = true;
  currentUser: User | null = null;
  userModules: string[] = [];

  availableModules = [
    { id: 'users', name: 'Gestión de Usuarios', icon: '👥', description: 'Administrar cuentas y permisos' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Métricas y reportes en tiempo real' },
    { id: 'reports', name: 'Reportes', icon: '📈', description: 'Generación de informes' },
    { id: 'settings', name: 'Configuración', icon: '⚙️', description: 'Ajustes del sistema' },
    { id: 'billing', name: 'Facturación', icon: '💳', description: 'Gestión de pagos' },
    { id: 'support', name: 'Soporte', icon: '🛠️', description: 'Centro de ayuda' }
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.userModules = this.currentUser?.modules || [];
    this.loadStats();
  }

  loadStats() {
    if (this.authService.isMaster() || this.authService.isAdmin()) {
      this.userService.findAll().subscribe({
        next: (data) => {
          this.users = data;
          this.totalUsers = data.length;
          this.activeUsers = data.filter(u => u.status === 'active').length;
          this.inactiveUsers = data.filter(u => u.status === 'inactive').length;
          this.suspendedUsers = data.filter(u => u.status === 'suspended').length;
          this.trialUsers = data.filter(u => u.status === 'trial').length;
          this.recentUsers = data.slice(-5).reverse();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  isMaster(): boolean {
    return this.authService.isMaster();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isUser(): boolean {
    return this.authService.isUser();
  }

  hasModule(moduleId: string): boolean {
    return this.userModules.includes(moduleId);
  }

  getRoleLabel(): string {
    switch (this.currentUser?.role) {
      case 'master': return 'Master';
      case 'admin': return 'Administrador';
      case 'user': return 'Usuario';
      default: return 'Sin rol';
    }
  }

  getRoleClass(): string {
    return this.currentUser?.role || 'user';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'suspended': return 'Suspendido';
      case 'trial': return 'Prueba';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  logout() {
    this.authService.logout();
  }
}
