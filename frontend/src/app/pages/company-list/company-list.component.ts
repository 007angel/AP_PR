import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { UserService } from '../../services/user.service';
import { Company } from '../../models/company.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';

  // Modal
  showModal = false;
  selectedCompany: Company | null = null;
  companyUsers: User[] = [];
  availableUsers: User[] = [];
  isLoadingUsers = false;

  constructor(
    private companyService: CompanyService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadCompanies();
    this.loadUsers();
  }

  loadCompanies() {
    this.isLoading = true;
    this.companyService.findAll().subscribe({
      next: (data) => {
        this.companies = data;
        this.filteredCompanies = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar empresas';
        this.isLoading = false;
      }
    });
  }

  loadUsers() {
    this.userService.findAll().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  filterCompanies() {
    this.filteredCompanies = this.companies.filter(company => {
      return company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             company.rif.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
             company.email.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  getPlanLabel(plan: string): string {
    switch (plan) {
      case 'basic': return 'Básico';
      case 'professional': return 'Profesional';
      case 'enterprise': return 'Empresarial';
      default: return plan;
    }
  }

  getPlanClass(plan: string): string {
    return `plan-${plan}`;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'suspended': return 'Suspendido';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  // Link users modal
  openLinkModal(company: Company) {
    this.selectedCompany = company;
    this.showModal = true;
    this.loadCompanyUsers(company.id!);
  }

  closeLinkModal() {
    this.showModal = false;
    this.selectedCompany = null;
    this.companyUsers = [];
    this.availableUsers = [];
  }

  loadCompanyUsers(companyId: number) {
    this.isLoadingUsers = true;
    this.companyService.getUsers(companyId).subscribe({
      next: (users) => {
        this.companyUsers = users;
        this.updateAvailableUsers();
        this.isLoadingUsers = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuarios de la empresa';
        this.isLoadingUsers = false;
      }
    });
  }

  updateAvailableUsers() {
    const linkedIds = this.companyUsers.map(u => u.id);
    this.availableUsers = this.users.filter(u => 
      !linkedIds.includes(u.id) && u.role !== 'master'
    );
  }

  linkUser(userId: number) {
    if (!this.selectedCompany) return;
    
    this.companyService.linkUser(this.selectedCompany.id!, userId).subscribe({
      next: () => {
        this.loadCompanyUsers(this.selectedCompany!.id!);
        this.successMessage = 'Usuario vinculado correctamente';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = 'Error al vincular usuario';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  unlinkUser(userId: number) {
    if (!this.selectedCompany) return;
    
    if (confirm('¿Estás seguro de desvincular este usuario?')) {
      this.companyService.unlinkUser(this.selectedCompany.id!, userId).subscribe({
        next: () => {
          this.loadCompanyUsers(this.selectedCompany!.id!);
          this.successMessage = 'Usuario desvinculado correctamente';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error al desvincular usuario';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }

  deleteCompany(id: number) {
    if (confirm('¿Estás seguro de eliminar esta empresa?')) {
      this.companyService.delete(id).subscribe({
        next: () => {
          this.companies = this.companies.filter(c => c.id !== id);
          this.filterCompanies();
          this.successMessage = 'Empresa eliminada correctamente';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar empresa';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
