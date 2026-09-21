const sequelize = require('../libs/sequelize');

class MovimientosService {
  async getResumen(companyId) {
    const companyFilter = companyId ? 'AND id.company_id = :companyId' : '';
    const companyFilter2 = companyId ? 'AND i.company_id = :companyId' : '';
    const companyFilter3 = companyId ? 'AND s.company_id = :companyId' : '';
    const replacements = companyId ? { companyId } : {};

    const stockQuery = `
      SELECT
        id.articulo,
        COALESCE(SUM(id.total_ingreso), 0) AS "totalIngresado",
        COALESCE(SUM(id.entregado), 0) AS "totalEntregado",
        COALESCE(SUM(id.mermas), 0) AS "totalMermas",
        COALESCE(SUM(id.total_ingreso - id.entregado - id.mermas), 0) AS "stockDisponible",
        COUNT(DISTINCT id.ingreso_id) AS "ingresosVinculados"
      FROM ingreso_detalle_tr id
      INNER JOIN ingreso_tr i ON i.id = id.ingreso_id AND i.status != 'anulado'
      WHERE 1=1 ${companyFilter}
      GROUP BY id.articulo
      ORDER BY id.articulo ASC
    `;

    const ingresosQuery = `
      SELECT
        i.id,
        i.correlativo,
        i.numero_factura AS "numeroFactura",
        i.fecha_ingreso AS "fechaIngreso",
        i.fecha_digitacion AS "fechaDigitacion",
        i.cantidad_tarimas AS "cantidadTarimas",
        i.usuario_digito AS "usuarioDigito",
        i.proveedor,
        i.status,
        i.valor_total AS "valorTotal",
        i.cliente_id AS "clienteId",
        c.nombre AS "clienteNombre",
        (SELECT COUNT(*) FROM ingreso_detalle_tr idet WHERE idet.ingreso_id = i.id) AS "detalleCount"
      FROM ingreso_tr i
      LEFT JOIN cliente_tr c ON c.id = i.cliente_id
      WHERE 1=1 ${companyFilter2}
      ORDER BY i.created_at DESC
      LIMIT 20
    `;

    const solicitudesQuery = `
      SELECT
        s.id,
        s.correlativo,
        s.fecha,
        s.solicitante,
        s.estado,
        s.observaciones,
        s.cliente_id AS "clienteId",
        c.nombre AS "clienteNombre",
        (SELECT COALESCE(SUM(sd.cantidad_solicitada), 0) FROM solicitud_detalle_tr sd WHERE sd.solicitud_id = s.id) AS "totalSolicitado",
        (SELECT COALESCE(SUM(sd.cantidad_entregada), 0) FROM solicitud_detalle_tr sd WHERE sd.solicitud_id = s.id) AS "totalEntregado",
        (SELECT COUNT(*) FROM solicitud_detalle_tr sd WHERE sd.solicitud_id = s.id) AS "detalleCount",
        (SELECT COUNT(*) FROM solicitud_detalle_tr sd WHERE sd.solicitud_id = s.id AND sd.cantidad_entregada >= sd.cantidad_solicitada) AS "detallesCompletos"
      FROM solicitud_tr s
      LEFT JOIN cliente_tr c ON c.id = s.cliente_id
      WHERE 1=1 ${companyFilter3}
      ORDER BY s.created_at DESC
      LIMIT 20
    `;

    const salidasQuery = `
      SELECT
        sd.articulo,
        sd.lote,
        sd.cantidad_solicitada AS "cantidadSolicitada",
        sd.cantidad_entregada AS "cantidadEntregada",
        sd.ingreso_id AS "ingresoId",
        i.correlativo AS "ingresoCorrelativo",
        s.correlativo AS "solicitudCorrelativo",
        s.estado AS "solicitudEstado",
        s.solicitante,
        s.fecha AS "solicitudFecha",
        s.cliente_id AS "clienteId",
        c.nombre AS "clienteNombre"
      FROM solicitud_detalle_tr sd
      INNER JOIN solicitud_tr s ON s.id = sd.solicitud_id
      INNER JOIN ingreso_tr i ON i.id = sd.ingreso_id
      LEFT JOIN cliente_tr c ON c.id = s.cliente_id
      WHERE sd.cantidad_solicitada > 0 ${companyFilter3}
      ORDER BY s.created_at DESC
      LIMIT 30
    `;

    const [stock] = await sequelize.query(stockQuery, { replacements });
    const [ingresos] = await sequelize.query(ingresosQuery, { replacements });
    const [solicitudes] = await sequelize.query(solicitudesQuery, { replacements });
    const [salidas] = await sequelize.query(salidasQuery, { replacements });

    const stats = {
      totalIngresado: stock.reduce((sum, s) => sum + (s.totalIngresado || 0), 0),
      totalEntregado: stock.reduce((sum, s) => sum + (s.totalEntregado || 0), 0),
      totalMermas: stock.reduce((sum, s) => sum + (s.totalMermas || 0), 0),
      stockDisponible: stock.reduce((sum, s) => sum + (s.stockDisponible || 0), 0),
      articulosConStock: stock.filter(s => s.stockDisponible > 0).length,
      solicitudesPendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
      solicitudesAprobadas: solicitudes.filter(s => s.estado === 'aprobado').length,
    };

    return { stats, stock, ingresos, solicitudes, salidas };
  }
}

module.exports = MovimientosService;
