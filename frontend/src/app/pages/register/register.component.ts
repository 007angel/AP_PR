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

  formErrors: { [key: string]: string } = {};

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
    this.formErrors = {};
    if (this.currentStep === 1) {
      let valid = true;
      if (!this.company.name) {
        this.formErrors['companyName'] = 'El nombre de la empresa es requerido';
        valid = false;
      }
      if (!this.company.rif) {
        this.formErrors['companyRif'] = 'El RIF es requerido';
        valid = false;
      }
      if (!this.company.email) {
        this.formErrors['companyEmail'] = 'El correo electrónico es requerido';
        valid = false;
      }
      if (!valid) {
        return;
      }
    }
    this.errorMessage = '';
    this.currentStep++;
  }

  prevStep() {
    this.errorMessage = '';
    this.formErrors = {};
    this.currentStep--;
  }

  onSubmit() {
    this.formErrors = {};
    let valid = true;

    if (!this.admin.name) {
      this.formErrors['adminName'] = 'El nombre es requerido';
      valid = false;
    }
    if (!this.admin.email) {
      this.formErrors['adminEmail'] = 'El correo electrónico es requerido';
      valid = false;
    }
    if (!this.admin.password) {
      this.formErrors['adminPassword'] = 'La contraseña es requerida';
      valid = false;
    }
    if (this.admin.password !== this.admin.confirmPassword) {
      this.formErrors['confirmPassword'] = 'Las contraseñas no coinciden';
      valid = false;
    }
    if (!this.acceptTerms) {
      this.formErrors['terms'] = 'Debes aceptar los términos y condiciones';
      valid = false;
    }
    if (!valid) {
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
