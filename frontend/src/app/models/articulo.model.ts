export interface Articulo {
  id?: number;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  unidad?: string;
  precio?: number;
  foto?: string;
  companyId?: number | null;
  userId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
