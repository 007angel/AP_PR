export interface SolicitudDetalle {
  id?: number;
  solicitudId: number;
  articulo: string;
  cantidadSolicitada: number;
  cantidadEntregada: number;
  ingresoId?: number | null;
  ingresoDetalleId?: number | null;
  lote?: string;
  companyId?: number;
  userId?: number;
  createdAt?: string;
  ingresoEncontrado?: {
    correlativo: string;
    factura: string;
  };
}

export interface Solicitud {
  id?: number;
  correlativo: string;
  fecha: string;
  solicitante: string;
  userId?: number;
  companyId?: number;
  clienteId?: number | null;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'completado';
  observaciones?: string;
  detalles?: SolicitudDetalle[];
  user?: { id: number; name: string; email: string };
  cliente?: { id: number; nombre: string; rif?: string; telefono?: string; email?: string };
  totalSolicitado?: number;
  totalEntregado?: number;
  createdAt?: string;
}

export interface CreateSolicitud {
  solicitante: string;
  userId?: number | null;
  companyId?: number | null;
  clienteId?: number | null;
  observaciones?: string;
  detalles: { articulo: string; cantidadSolicitada: number }[];
}

export interface AvailableArticle {
  id: number;
  articulo: string;
  lote: string;
  total_ingreso: number;
  entregado: number;
  mermas: number;
  devolucion: number;
  disponible: number;
  ingreso_id: number;
  ingresoCorrelativo: string;
  numeroFactura: string;
  fechaIngreso: string;
}
