export interface IngresoDetalle {
  id?: number;
  ingreso_id: number;
  lote: string;
  articulo: string;
  tarima: number;
  caja: number;
  unidad: number;
  totalIngreso: number;
  solicitado: number;
  entregado: number;
  mermas: number;
  devolucion: number;
  costoIndividual: number;
  created_at?: Date;
  updated_at?: Date;
}
