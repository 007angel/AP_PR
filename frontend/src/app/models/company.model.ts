export interface Company {
  id?: number;
  name: string;
  rif: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  logo?: string;
  website?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'basic' | 'professional' | 'enterprise';
  maxUsers: number;
  createdAt?: string;
  updatedAt?: string;
}
