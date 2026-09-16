export interface Modulo {
  id?: number;
  nombre: string;
  ruta: string;
  icono?: string;
  orden: number;
  seccion?: string | null;
  activo: boolean;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}
