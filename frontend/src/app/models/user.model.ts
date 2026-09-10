export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: 'master' | 'admin' | 'user';
  modules?: string[];
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  companyId?: number;
  createdAt?: string;
  updatedAt?: string;
}
