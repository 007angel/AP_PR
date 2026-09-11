export interface Ingreso {
  id?: number;
  correlativo: string;
  numeroFactura: string;
  fechaIngreso: Date | string;
  fechaDigitacion: Date | string;
  cantidadTarimas: number;
  usuarioDigito: string;
  proveedor?: string;
  observaciones?: string;
  status?: 'pendiente' | 'completado' | 'cancelado';
  valorTotal?: number;
  companyId?: number;
  userId?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
