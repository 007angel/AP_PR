import { Routes } from '@angular/router';
import { SolutionsComponent } from './pages/solutions/solutions.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: SolutionsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['master', 'admin'] } },
  { path: 'users/new', component: UserFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['master', 'admin'] } },
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['master', 'admin'] } },
  { path: '**', redirectTo: '' }
];
