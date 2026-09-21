const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const CorrelativoTrService = require('./correlativo.service');

class SolicitudService {
  constructor() {
    this.correlativoService = new CorrelativoTrService();
  }

  async create(data, companyId, userId) {
    const empId = companyId || data.companyId || 1;
    const correlativo = await this.correlativoService.generateCorrelativo(empId, 'sol');

    const solicitud = await sequelize.models.SolicitudTr.create({
      correlativo,
      fecha: new Date(),
      solicitante: data.solicitante,
      userId: userId || data.userId || null,
      companyId: companyId || data.companyId || null,
      clienteId: data.clienteId || null,
      estado: 'pendiente',
      observaciones: data.observaciones || null
    });

    const detallesCreados = [];

    for (const det of (data.detalles || [])) {
      // Buscar ingreso con stock disponible para este articulo
      const match = await this.findStockForArticle(det.articulo, det.cantidadSolicitada, companyId);

      const detalle = await sequelize.models.SolicitudDetalleTr.create({
        solicitudId: solicitud.id,
        articulo: det.articulo,
        articuloId: det.artuloId || null,
        cantidadSolicitada: det.cantidadSolicitada,
        cantidadEntregada: 0,
        ingresoId: match ? match.ingreso_id : null,
        ingresoDetalleId: match ? match.id : null,
        lote: match ? match.lote : null,
        companyId: companyId || data.companyId || null,
        userId: userId || data.userId || null
      });

      detallesCreados.push({
        ...detalle.dataValues,
        ingresoEncontrado: match ? {
          correlativo: match.ingresoCorrelativo,
          factura: match.numeroFactura
        } : null
      });
    }

    return {
      solicitud: solicitud.dataValues,
      detalles: detallesCreados
    };
  }

  async findStockForArticle(articulo, cantidadRequerida, companyId) {
    const query = `
      SELECT
        id.id,
        id.lote,
        id.articulo,
        id.total_ingreso,
        id.entregado,
        id.mermas,
        id.devolucion,
        id.ingreso_id,
        i.correlativo AS "ingresoCorrelativo",
        i.numero_factura AS "numeroFactura",
        (id.total_ingreso - id.entregado - id.mermas) AS disponible
      FROM ingreso_detalle_tr id
      INNER JOIN ingreso_tr i ON i.id = id.ingreso_id
      WHERE id.articulo ILIKE :articulo
        AND i.status != 'anulado'
        ${companyId ? 'AND id.company_id = :companyId' : ''}
      ORDER BY id.id ASC
      LIMIT 1
    `;

    const replacements = {
      articulo: `%${articulo}%`,
      cantidad: cantidadRequerida || 1
    };

    if (companyId) {
      replacements.companyId = companyId;
    }

    const [results] = await sequelize.query(query, { replacements });
    return results && results.length > 0 ? results[0] : null;
  }

  async findAvailableArticles(companyId) {
    const whereClause = companyId ? 'WHERE id.company_id = :companyId AND' : 'WHERE';
    let query = `
      SELECT
        id.id,
        id.articulo,
        id.lote,
        id.total_ingreso,
        id.entregado,
        id.mermas,
        id.devolucion,
        (id.total_ingreso - id.entregado - id.mermas) AS disponible,
        id.ingreso_id,
        i.correlativo AS "ingresoCorrelativo",
        i.numero_factura AS "numeroFactura",
        i.fecha_ingreso AS "fechaIngreso"
      FROM ingreso_detalle_tr id
      INNER JOIN ingreso_tr i ON i.id = id.ingreso_id AND i.status != 'anulado'
      ${whereClause} (id.total_ingreso - id.entregado - id.mermas) > 0
      ORDER BY id.articulo ASC, id.id ASC
    `;

    const replacements = {};
    if (companyId) {
      replacements.companyId = companyId;
    }

    const [results] = await sequelize.query(query, { replacements });
    return results;
  }

  async findByIngreso(ingresoId) {
    const detalles = await sequelize.models.SolicitudDetalleTr.findAll({
      where: { ingresoId },
      raw: true
    });

    if (detalles.length === 0) return [];

    const solicitudIds = [...new Set(detalles.map(d => d.solicitudId))];

    const solicitudes = await sequelize.models.SolicitudTr.findAll({
      where: { id: solicitudIds },
      include: [
        { model: sequelize.models.SolicitudDetalleTr, as: 'detalles', where: { ingresoId } },
        { model: sequelize.models.UserTr, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: sequelize.models.ClienteTr, as: 'cliente', attributes: ['id', 'nombre', 'rif'] }
      ],
      order: [['created_at', 'DESC']],
      raw: false
    });

    return solicitudes.map(s => {
      const plain = s.toJSON();
      plain.totalSolicitado = plain.detalles ? plain.detalles.reduce((sum, d) => sum + (d.cantidadSolicitada || 0), 0) : 0;
      plain.totalEntregado = plain.detalles ? plain.detalles.reduce((sum, d) => sum + (d.cantidadEntregada || 0), 0) : 0;
      return plain;
    });
  }

  async find(filters = {}) {
    const where = {};
    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.estado) where.estado = filters.estado;
    if (filters.userId) where.userId = filters.userId;

    const solicitudes = await sequelize.models.SolicitudTr.findAll({
      where,
      include: [
        { model: sequelize.models.SolicitudDetalleTr, as: 'detalles' },
        { model: sequelize.models.UserTr, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: sequelize.models.ClienteTr, as: 'cliente', attributes: ['id', 'nombre', 'rif', 'telefono'] }
      ],
      order: [['created_at', 'DESC']],
      raw: false
    });

    return solicitudes.map(s => {
      const plain = s.toJSON();
      plain.totalSolicitado = plain.detalles ? plain.detalles.reduce((sum, d) => sum + (d.cantidadSolicitada || 0), 0) : 0;
      plain.totalEntregado = plain.detalles ? plain.detalles.reduce((sum, d) => sum + (d.cantidadEntregada || 0), 0) : 0;
      return plain;
    });
  }

  async findOne(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const solicitud = await sequelize.models.SolicitudTr.findOne({
      where,
      include: [
        { model: sequelize.models.SolicitudDetalleTr, as: 'detalles' },
        { model: sequelize.models.UserTr, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: sequelize.models.ClienteTr, as: 'cliente', attributes: ['id', 'nombre', 'rif', 'telefono', 'email'] }
      ],
      raw: false
    });
    if (!solicitud) return null;
    const plain = solicitud.toJSON();
    plain.totalSolicitado = plain.detalles ? plain.detalles.reduce((sum, d) => sum + (d.cantidadSolicitada || 0), 0) : 0;
    plain.totalEntregado = plain.detalles ? plain.detalles.reduce((sum, d) => sum + (d.cantidadEntregada || 0), 0) : 0;
    return plain;
  }

  async updateEstado(id, nuevoEstado, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const solicitud = await sequelize.models.SolicitudTr.findOne({ where });
    if (!solicitud) return null;
    await solicitud.update({ estado: nuevoEstado });
    return await this.findOne(id, companyId);
  }

  async updateDetalleEntrega(detalleId, cantidadEntregada, companyId) {
    const detalle = await sequelize.models.SolicitudDetalleTr.findByPk(detalleId);
    if (!detalle) throw boom.notFound('Detalle de solicitud no encontrado');
    if (companyId) {
      const solicitud = await sequelize.models.SolicitudTr.findOne({ where: { id: detalle.solicitudId, companyId } });
      if (!solicitud) throw boom.notFound('Detalle no pertenece a esta empresa');
    }
    if (cantidadEntregada < 0) throw boom.badRequest('La cantidad entregada no puede ser negativa');
    if (cantidadEntregada > detalle.cantidadSolicitada) {
      throw boom.badRequest(`La cantidad entregada (${cantidadEntregada}) no puede superar la solicitada (${detalle.cantidadSolicitada})`);
    }
    await detalle.update({ cantidadEntregada });

    const solicitud = await sequelize.models.SolicitudTr.findByPk(detalle.solicitudId);
    if (solicitud) {
      const allDetalles = await sequelize.models.SolicitudDetalleTr.findAll({
        where: { solicitudId: detalle.solicitudId },
        raw: true
      });
      const allComplete = allDetalles.every(d =>
        d.cantidadEntregada >= d.cantidadSolicitada
      );
      if (allComplete && solicitud.estado !== 'completado') {
        await solicitud.update({ estado: 'completado' });
      }
    }

    return await sequelize.models.SolicitudDetalleTr.findByPk(detalleId, { raw: true });
  }

  async update(id, changes, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const solicitud = await sequelize.models.SolicitudTr.findOne({ where });
    if (!solicitud) return null;

    if (changes.estado) {
      await solicitud.update({ estado: changes.estado });
    }
    if (changes.observaciones !== undefined) {
      await solicitud.update({ observaciones: changes.observaciones });
    }
    if (changes.cantidadEntregada !== undefined && changes.detalleId) {
      const detalle = await sequelize.models.SolicitudDetalleTr.findByPk(changes.detalleId);
      if (detalle) {
        await detalle.update({ cantidadEntregada: changes.cantidadEntregada });
      }
    }

    return await this.findOne(id, companyId);
  }

  async delete(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const solicitud = await sequelize.models.SolicitudTr.findOne({ where });
    if (!solicitud) return null;
    if (solicitud.estado === 'completado') {
      throw boom.conflict('No se puede eliminar una solicitud completada');
    }
    await sequelize.models.SolicitudDetalleTr.destroy({ where: { solicitudId: id } });
    await solicitud.destroy();
    return { id };
  }

  async getStats(companyId) {
    const where = companyId ? { companyId } : {};
    const total = await sequelize.models.SolicitudTr.count({ where });
    const pendientes = await sequelize.models.SolicitudTr.count({ where: { ...where, estado: 'pendiente' } });
    const aprobadas = await sequelize.models.SolicitudTr.count({ where: { ...where, estado: 'aprobado' } });
    const completadas = await sequelize.models.SolicitudTr.count({ where: { ...where, estado: 'completado' } });
    const rechazadas = await sequelize.models.SolicitudTr.count({ where: { ...where, estado: 'rechazado' } });
    return { total, pendientes, aprobadas, completadas, rechazadas };
  }
}

module.exports = SolicitudService;
