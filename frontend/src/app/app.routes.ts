import { Routes } from '@angular/router';
import { SolutionsComponent } from './pages/solutions/solutions.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { CompanyListComponent } from './pages/company-list/company-list.component';
import { CompanyFormComponent } from './pages/company-form/company-form.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Inventory components
import { InventoryLayoutComponent } from './pages/inventory/inventory-layout.component';
import { InventoryDashboardComponent } from './pages/inventory/dashboard/inventory-dashboard.component';
import { IngresoListComponent } from './pages/inventory/ingreso/ingreso-list.component';
import { IngresoDetailComponent } from './pages/inventory/ingreso/ingreso-detail.component';
import { IngresoDetalleFormComponent } from './pages/inventory/ingreso-detalle/ingreso-detalle-form.component';
import { MovimientoDetailComponent } from './pages/inventory/ingreso/movimiento-detail.component';
import { SalidaListComponent } from './pages/inventory/salida/salida-list.component';
import { SalidaDetailComponent } from './pages/inventory/salida/salida-detail.component';
import { SolicitudesListComponent } from './pages/inventory/solicitudes/solicitudes-list.component';
import { SolicitudesDetailComponent } from './pages/inventory/solicitudes/solicitudes-detail.component';
import { ReporteMovimientosComponent } from './pages/inventory/reportes/reporte-movimientos.component';
import { ReporteIngresosComponent } from './pages/inventory/reportes/reporte-ingresos.component';
import { ReporteSalidasComponent } from './pages/inventory/reportes/reporte-salidas.component';

export const routes: Routes = [
  { path: '', component: SolutionsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['master', 'admin'] } },
  { path: 'users/new', component: UserFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['master', 'admin'] } },
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['master', 'admin'] } },
  { path: 'companies', component: CompanyListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['master', 'admin'] } },
  { path: 'companies/new', component: CompanyFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['master', 'admin'] } },
  { path: 'companies/edit/:id', component: CompanyFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['master', 'admin'] } },
  
  // Inventory routes
  {
    path: 'inventory',
    component: InventoryLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: InventoryDashboardComponent },
      { path: 'ingreso', component: IngresoListComponent },
      { path: 'ingreso/new', component: IngresoDetailComponent },
      { path: 'ingreso/:id', component: IngresoDetailComponent },
      { path: 'ingreso/:ingresoId/detalle', component: IngresoDetalleFormComponent },
      { path: 'ingreso/movimientos', component: MovimientoDetailComponent },
      { path: 'ingreso/movimientos/:id', component: MovimientoDetailComponent },
      { path: 'salida', component: SalidaListComponent },
      { path: 'salida/new', component: SalidaDetailComponent },
      { path: 'salida/:id', component: SalidaDetailComponent },
      { path: 'solicitudes', component: SolicitudesListComponent },
      { path: 'solicitudes/new', component: SolicitudesDetailComponent },
      { path: 'solicitudes/:id', component: SolicitudesDetailComponent },
      { path: 'reportes', redirectTo: 'reportes/movimientos', pathMatch: 'full' },
      { path: 'reportes/movimientos', component: ReporteMovimientosComponent },
      { path: 'reportes/ingresos', component: ReporteIngresosComponent },
      { path: 'reportes/salidas', component: ReporteSalidasComponent }
    ]
  },
  
  { path: '**', redirectTo: '' }
];
