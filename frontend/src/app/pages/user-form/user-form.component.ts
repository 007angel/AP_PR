import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  user: User = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    modules: [],
    status: 'active'
  };

  isEditMode = false;
  userId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number) {
    this.isLoading = true;
    this.userService.findOne(id).subscribe({
      next: (data) => {
        this.user = {
          name: data.name,
          email: data.email,
          role: data.role || 'user',
          modules: data.modules || [],
          status: data.status
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuario';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser() {
    this.isSubmitting = true;
    this.userService.create(this.user).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear usuario';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }

  updateUser() {
    this.isSubmitting = true;
    const changes: Partial<User> = {
      name: this.user.name,
      email: this.user.email,
      role: this.user.role,
      modules: this.user.modules,
      status: this.user.status
    };
    this.userService.update(this.userId!, changes).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar usuario';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }

  toggleModule(moduleId: string) {
    if (!this.user.modules) {
      this.user.modules = [];
    }
    const index = this.user.modules.indexOf(moduleId);
    if (index === -1) {
      this.user.modules.push(moduleId);
    } else {
      this.user.modules.splice(index, 1);
    }
  }

  isModuleSelected(moduleId: string): boolean {
    return this.user.modules?.includes(moduleId) || false;
  }

  isMaster(): boolean {
    return this.authService.isMaster();
  }
}
