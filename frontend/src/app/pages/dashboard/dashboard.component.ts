import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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

  // Modal properties for editing
  showUserModal = false;
  showUsersListModal = false;
  selectedUser: User | null = null;
  editStatus = '';
  editModules: string[] = [];
  isSaving = false;
  modalError = '';
  modalSuccess = '';

  // Modal properties for creation
  showCreateModal = false;
  isCreating = false;
  createError = '';
  newUser: User = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    modules: [],
    status: 'active'
  };

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

  openUserModal(user: User) {
    this.selectedUser = user;
    this.editStatus = user.status;
    this.editModules = user.modules ? [...user.modules] : [];
    this.showUserModal = true;
    this.modalError = '';
    this.modalSuccess = '';
  }

  closeUserModal() {
    this.showUserModal = false;
    this.selectedUser = null;
    this.editStatus = '';
    this.editModules = [];
    this.modalError = '';
    this.modalSuccess = '';
  }

  openUsersListModal() {
    this.showUsersListModal = true;
  }

  closeUsersListModal() {
    this.showUsersListModal = false;
  }

  toggleModule(moduleId: string) {
    const index = this.editModules.indexOf(moduleId);
    if (index === -1) {
      this.editModules.push(moduleId);
    } else {
      this.editModules.splice(index, 1);
    }
  }

  isModuleSelected(moduleId: string): boolean {
    return this.editModules.includes(moduleId);
  }

  saveUserChanges() {
    if (!this.selectedUser) return;
    this.isSaving = true;
    this.modalError = '';

    const changes: Partial<User> = {
      status: this.editStatus as any,
      modules: this.editModules
    };

    this.userService.update(this.selectedUser.id!, changes).subscribe({
      next: (updated) => {
        const index = this.users.findIndex(u => u.id === updated.id);
        if (index !== -1) {
          this.users[index] = updated;
        }
        this.recentUsers = this.users.slice(-5).reverse();
        this.modalSuccess = 'Usuario actualizado correctamente';
        this.isSaving = false;
        setTimeout(() => {
          this.closeUserModal();
        }, 1500);
      },
      error: (err) => {
        this.modalError = err.error?.message || 'Error al actualizar usuario';
        this.isSaving = false;
      }
    });
  }

  // Create user modal methods
  openCreateModal() {
    this.resetNewUser();
    this.showCreateModal = true;
    this.createError = '';
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetNewUser();
    this.createError = '';
  }

  resetNewUser() {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'user',
      modules: [],
      status: 'active'
    };
  }

  toggleCreateModule(moduleId: string) {
    if (!this.newUser.modules) {
      this.newUser.modules = [];
    }
    const index = this.newUser.modules.indexOf(moduleId);
    if (index === -1) {
      this.newUser.modules.push(moduleId);
    } else {
      this.newUser.modules.splice(index, 1);
    }
  }

  isCreateModuleSelected(moduleId: string): boolean {
    return this.newUser.modules?.includes(moduleId) || false;
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.createError = 'Nombre, email y contraseña son requeridos';
      return;
    }

    this.isCreating = true;
    this.createError = '';

    this.userService.create(this.newUser).subscribe({
      next: (created) => {
        this.users.unshift(created);
        this.totalUsers = this.users.length;
        this.activeUsers = this.users.filter(u => u.status === 'active').length;
        this.recentUsers = this.users.slice(-5).reverse();
        this.modalSuccess = 'Usuario creado correctamente';
        this.isCreating = false;
        setTimeout(() => {
          this.closeCreateModal();
          this.modalSuccess = '';
        }, 1500);
      },
      error: (err) => {
        this.createError = err.error?.message || 'Error al crear usuario';
        this.isCreating = false;
      }
    });
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
