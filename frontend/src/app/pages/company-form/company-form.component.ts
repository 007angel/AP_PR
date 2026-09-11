import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  company: Company = {
    name: '',
    rif: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Venezuela',
    website: '',
    status: 'active',
    plan: 'basic',
    maxUsers: 5
  };

  isEditMode = false;
  companyId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  formErrors: { [key: string]: string } = {};

  plans = [
    { id: 'basic', name: 'Básico', users: 5, price: 'Gratis' },
    { id: 'professional', name: 'Profesional', users: 25, price: '$29/mes' },
    { id: 'enterprise', name: 'Empresarial', users: 100, price: '$99/mes' }
  ];

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.companyId = +id;
      this.loadCompany(this.companyId);
    }
  }

  loadCompany(id: number) {
    this.isLoading = true;
    this.companyService.findOne(id).subscribe({
      next: (data) => {
        this.company = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar empresa';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit() {
    this.formErrors = {};
    if (!this.validateForm()) {
      return;
    }

    if (this.isEditMode) {
      this.updateCompany();
    } else {
      this.createCompany();
    }
  }

  validateForm(): boolean {
    let valid = true;
    
    if (!this.company.name) {
      this.formErrors['name'] = 'El nombre de la empresa es requerido';
      valid = false;
    }
    if (!this.company.rif) {
      this.formErrors['rif'] = 'El RIF es requerido';
      valid = false;
    }
    if (!this.company.email) {
      this.formErrors['email'] = 'El correo electrónico es requerido';
      valid = false;
    }
    
    return valid;
  }

  createCompany() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.companyService.create(this.company).subscribe({
      next: () => {
        this.successMessage = 'Empresa creada correctamente';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/companies']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear empresa';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }

  updateCompany() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.companyService.update(this.companyId!, this.company).subscribe({
      next: () => {
        this.successMessage = 'Empresa actualizada correctamente';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/companies']);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar empresa';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }

  selectPlan(planId: string) {
    const plan = this.plans.find(p => p.id === planId);
    if (plan) {
      this.company.plan = planId as any;
      this.company.maxUsers = plan.users;
    }
  }
}
