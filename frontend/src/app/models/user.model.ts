export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: 'master' | 'admin' | 'user';
  modules?: string[];
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  companyId?: number;
  codigo?: string;
  createdByCompanyId?: number | null;
  idUsuarioMaster?: number | null;
  idEmpresaMaster?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
