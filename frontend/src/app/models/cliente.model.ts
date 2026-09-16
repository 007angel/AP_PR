export interface Cliente {
  id?: number;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  rif?: string;
  contacto?: string;
  observaciones?: string;
  companyId?: number | null;
  userId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
