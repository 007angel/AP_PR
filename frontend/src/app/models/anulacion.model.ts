export interface Anulacion {
  id?: number;
  ingresoId: number;
  motivo?: string | null;
  solicitadoPor?: number | null;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  createdAt?: string;
  updatedAt?: string;
  ingreso?: {
    id: number;
    correlativo: string;
    numeroFactura: string | null;
    status: string;
    companyId: number | null;
  };
  solicitante?: {
    id: number;
    name: string;
    email: string;
  } | null;
}
