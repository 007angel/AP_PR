import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  filterRole = 'all';
  filterStatus = 'all';

  showModal = false;
  selectedUser: User | null = null;
  editRole = '';
  editStatus = '';
  editModules: string[] = [];
  isSaving = false;

  availableModules = [
    { id: 'users', name: 'Gestión de Usuarios', icon: '👥' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'reports', name: 'Reportes', icon: '📈' },
    { id: 'settings', name: 'Configuración', icon: '⚙️' },
    { id: 'billing', name: 'Facturación', icon: '💳' },
    { id: 'support', name: 'Soporte', icon: '🛠️' }
  ];

  constructor(
    private userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.findAll().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuarios';
        this.isLoading = false;
      }
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.filterRole === 'all' || user.role === this.filterRole;
      const matchesStatus = this.filterStatus === 'all' || user.status === this.filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  calculateDaysSince(date: string): number {
    const created = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'master': return 'Master';
      case 'admin': return 'Admin';
      case 'user': return 'Usuario';
      default: return role;
    }
  }

  getRoleClass(role: string): string {
    return `role-${role}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
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

  getStatusCount(status: string): number {
    return this.users.filter(u => u.status === status).length;
  }

  getModuleNames(modules: string[] | undefined): string {
    if (!modules || modules.length === 0) return 'Sin módulos';
    return modules.map(m => {
      const found = this.availableModules.find(am => am.id === m);
      return found ? found.name : m;
    }).join(', ');
  }

  openEditModal(user: User) {
    this.selectedUser = user;
    this.editRole = user.role;
    this.editStatus = user.status;
    this.editModules = user.modules ? [...user.modules] : [];
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.editRole = '';
    this.editStatus = '';
    this.editModules = [];
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

  saveChanges() {
    if (!this.selectedUser) return;
    this.isSaving = true;
    this.errorMessage = '';

    const changes: Partial<User> = {
      role: this.editRole as any,
      status: this.editStatus as any,
      modules: this.editModules
    };

    this.userService.update(this.selectedUser.id!, changes).subscribe({
      next: (updated) => {
        const index = this.users.findIndex(u => u.id === updated.id);
        if (index !== -1) {
          this.users[index] = updated;
        }
        this.filterUsers();
        this.successMessage = `Usuario ${updated.name} actualizado correctamente`;
        this.isSaving = false;
        setTimeout(() => {
          this.closeModal();
          this.successMessage = '';
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar usuario';
        this.isSaving = false;
      }
    });
  }

  toggleUserStatus(user: User) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activar' : 'desactivar';

    if (confirm(`¿Estás seguro de ${action} a ${user.name}?`)) {
      this.userService.update(user.id!, { status: newStatus as any }).subscribe({
        next: (updated) => {
          const index = this.users.findIndex(u => u.id === updated.id);
          if (index !== -1) {
            this.users[index] = updated;
          }
          this.filterUsers();
          this.successMessage = `Usuario ${action}do correctamente`;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error al cambiar estado del usuario';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.filterUsers();
          this.successMessage = 'Usuario eliminado correctamente';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar usuario';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
