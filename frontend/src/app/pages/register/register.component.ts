import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  currentStep = 1;
  isLoading = false;
  errorMessage = '';

  company = {
    name: '',
    rif: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Venezuela'
  };

  admin = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  acceptTerms = false;

  constructor(
    private companyService: CompanyService,
    private router: Router
  ) {}

  nextStep() {
    if (this.currentStep === 1) {
      if (!this.company.name || !this.company.rif || !this.company.email) {
        this.errorMessage = 'Nombre, RIF y email de la empresa son requeridos';
        return;
      }
    }
    this.errorMessage = '';
    this.currentStep++;
  }

  prevStep() {
    this.errorMessage = '';
    this.currentStep--;
  }

  onSubmit() {
    if (this.admin.password !== this.admin.confirmPassword) {
      this.errorMessage = 'Las contrasenas no coinciden';
      return;
    }
    if (!this.acceptTerms) {
      this.errorMessage = 'Debes aceptar los terminos y condiciones';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const cleanCompany: any = {
      name: this.company.name,
      rif: this.company.rif,
      email: this.company.email
    };
    if (this.company.phone) cleanCompany.phone = this.company.phone;
    if (this.company.address) cleanCompany.address = this.company.address;
    if (this.company.city) cleanCompany.city = this.company.city;
    if (this.company.state) cleanCompany.state = this.company.state;
    if (this.company.country) cleanCompany.country = this.company.country;

    this.companyService.register(cleanCompany, {
      name: this.admin.name,
      email: this.admin.email,
      password: this.admin.password
    }).subscribe({
      next: (result) => {
        localStorage.setItem('user', JSON.stringify(result.admin));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear la empresa';
        this.isLoading = false;
      }
    });
  }
}
