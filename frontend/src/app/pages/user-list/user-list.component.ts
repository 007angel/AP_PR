import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
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

  // Selection
  selectedUsers: Set<number> = new Set();
  selectAll = false;

  // Modal
  showModal = false;
  selectedUser: User | null = null;
  editRole = '';
  editStatus = '';
  editModules: string[] = [];
  isSaving = false;

  availableModules = [
    { id: 'users', name: 'Gestion de Usuarios' },
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'reports', name: 'Reportes' },
    { id: 'settings', name: 'Configuracion' },
    { id: 'billing', name: 'Facturacion' },
    { id: 'support', name: 'Soporte' }
  ];

  // Company assignment modal
  showCompanyModal = false;
  companies: Company[] = [];
  selectedCompanyId: number | null = null;
  isAssigningCompany = false;

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    const companyId = this.authService.getCompanyId();

    if (this.authService.isAdmin() && companyId) {
      this.userService.findByCompany(companyId).subscribe({
        next: (data) => {
          this.users = data;
          this.filteredUsers = data;
          this.isLoading = false;
          this.updateSelectAll();
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar usuarios';
          this.isLoading = false;
        }
      });
    } else {
      this.userService.findAll().subscribe({
        next: (data) => {
          this.users = data;
          this.filteredUsers = data;
          this.isLoading = false;
          this.updateSelectAll();
        },
        error: (err) => {
          this.errorMessage = 'Error al cargar usuarios';
          this.isLoading = false;
        }
      });
    }
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.filterRole === 'all' || user.role === this.filterRole;
      const matchesStatus = this.filterStatus === 'all' || user.status === this.filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
    this.updateSelectAll();
  }

  // Selection methods
  toggleSelectAll() {
    if (this.selectAll) {
      this.filteredUsers.forEach(user => {
        if (user.id) this.selectedUsers.add(user.id);
      });
    } else {
      this.selectedUsers.clear();
    }
  }

  toggleUserSelection(userId: number) {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
    this.updateSelectAll();
  }

  updateSelectAll() {
    this.selectAll = this.filteredUsers.length > 0 && 
                     this.filteredUsers.every(user => user.id && this.selectedUsers.has(user.id));
  }

  isSelected(userId: number): boolean {
    return this.selectedUsers.has(userId);
  }

  getSelectedCount(): number {
    return this.selectedUsers.size;
  }

  clearSelection() {
    this.selectedUsers.clear();
    this.selectAll = false;
  }

  // Bulk actions
  bulkActivate() {
    const count = this.selectedUsers.size;
    if (count === 0) return;

    if (confirm(`¿Estás seguro de activar ${count} usuario(s)?`)) {
      const ids = Array.from(this.selectedUsers);
      let completed = 0;

      ids.forEach(id => {
        this.userService.update(id, { status: 'active' as any }).subscribe({
          next: (updated) => {
            const index = this.users.findIndex(u => u.id === updated.id);
            if (index !== -1) {
              this.users[index] = updated;
            }
            completed++;
            if (completed === ids.length) {
              this.filterUsers();
              this.successMessage = `${count} usuario(s) activado(s) correctamente`;
              this.clearSelection();
              setTimeout(() => this.successMessage = '', 3000);
            }
          },
          error: () => {
            completed++;
            if (completed === ids.length) {
              this.filterUsers();
              this.errorMessage = 'Error al activar algunos usuarios';
              setTimeout(() => this.errorMessage = '', 3000);
            }
          }
        });
      });
    }
  }

  bulkDeactivate() {
    const count = this.selectedUsers.size;
    if (count === 0) return;

    if (confirm(`¿Estás seguro de desactivar ${count} usuario(s)?`)) {
      const ids = Array.from(this.selectedUsers);
      let completed = 0;

      ids.forEach(id => {
        this.userService.update(id, { status: 'inactive' as any }).subscribe({
          next: (updated) => {
            const index = this.users.findIndex(u => u.id === updated.id);
            if (index !== -1) {
              this.users[index] = updated;
            }
            completed++;
            if (completed === ids.length) {
              this.filterUsers();
              this.successMessage = `${count} usuario(s) desactivado(s) correctamente`;
              this.clearSelection();
              setTimeout(() => this.successMessage = '', 3000);
            }
          },
          error: () => {
            completed++;
            if (completed === ids.length) {
              this.filterUsers();
              this.errorMessage = 'Error al desactivar algunos usuarios';
              setTimeout(() => this.errorMessage = '', 3000);
            }
          }
        });
      });
    }
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

  getCompanyName(companyId: number): string {
    const company = this.companies.find(c => c.id === companyId);
    return company ? company.name : 'Empresa desconocida';
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

  openCompanyModal(user: User) {
    this.selectedUser = user;
    this.selectedCompanyId = user.companyId || null;
    this.showCompanyModal = true;
    this.errorMessage = '';
    this.loadCompanies();
  }

  closeCompanyModal() {
    this.showCompanyModal = false;
    this.selectedUser = null;
    this.selectedCompanyId = null;
  }

  loadCompanies() {
    this.companyService.findAll().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: () => {
        this.errorMessage = 'Error al cargar empresas';
      }
    });
  }

  assignCompany() {
    if (!this.selectedUser || this.selectedCompanyId === null) return;
    this.isAssigningCompany = true;

    this.companyService.linkUser(this.selectedCompanyId, this.selectedUser.id!).subscribe({
      next: () => {
        const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
        if (index !== -1) {
          this.users[index].companyId = this.selectedCompanyId!;
        }
        this.filterUsers();
        this.successMessage = `Empresa asignada correctamente a ${this.selectedUser!.name}`;
        this.isAssigningCompany = false;
        setTimeout(() => {
          this.closeCompanyModal();
          this.successMessage = '';
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al asignar empresa';
        this.isAssigningCompany = false;
      }
    });
  }

  unlinkCompany() {
    if (!this.selectedUser) return;
    this.isAssigningCompany = true;

    this.companyService.unlinkUser(this.selectedUser.companyId!, this.selectedUser.id!).subscribe({
      next: () => {
        const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
        if (index !== -1) {
          this.users[index].companyId = undefined;
        }
        this.filterUsers();
        this.successMessage = `Empresa desvinculada de ${this.selectedUser!.name}`;
        this.selectedCompanyId = null;
        this.isAssigningCompany = false;
        setTimeout(() => {
          this.closeCompanyModal();
          this.successMessage = '';
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al desvincular empresa';
        this.isAssigningCompany = false;
      }
    });
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
          this.selectedUsers.delete(id);
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
