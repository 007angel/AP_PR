const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class AnulacionService {
  includeOptions() {
    return [
      { model: models.IngresoTr, as: 'ingreso', attributes: ['id', 'correlativo', 'numeroFactura', 'status', 'companyId'] },
      { model: models.UserTr, as: 'solicitante', attributes: ['id', 'name', 'email'] }
    ];
  }

  async find(companyId) {
    const where = companyId ? { companyId } : {};
    const rows = await models.AnulacionTr.findAll({
      where,
      include: this.includeOptions(),
      order: [['id', 'DESC']]
    });
    return rows.map(r => r.toJSON());
  }

  async findOne(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const row = await models.AnulacionTr.findOne({ where, include: this.includeOptions() });
    if (!row) {
      throw boom.notFound('Solicitud no encontrada');
    }
    return row.toJSON();
  }

  async create(data) {
    const ingresoId = data.ingresoId ?? data.ingreso_id;
    if (!ingresoId) {
      throw boom.badRequest('ingreso_id es requerido');
    }
    const ingreso = await models.IngresoTr.findByPk(ingresoId);
    if (!ingreso) {
      throw boom.notFound('Ingreso no encontrado');
    }
    if (ingreso.status === 'anulado') {
      throw boom.conflict('El ingreso ya esta anulado');
    }
    const companyId = data.companyId || ingreso.companyId || null;
    const pending = await models.AnulacionTr.findOne({
      where: { ingresoId, estado: 'pendiente' }
    });
    if (pending) {
      throw boom.conflict('Ya existe una solicitud pendiente para este ingreso');
    }
    const created = await models.AnulacionTr.create({
      ingresoId,
      motivo: data.motivo || null,
      solicitadoPor: data.solicitadoPor ?? data.solicitado_por ?? null,
      companyId,
      estado: 'pendiente'
    });
    return await this.findOne(created.id);
  }

  async update(id, changes, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const row = await models.AnulacionTr.findOne({ where });
    if (!row) {
      throw boom.notFound('Solicitud no encontrada');
    }
    await row.update(changes);
    return await this.findOne(id, companyId);
  }

  async approve(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const row = await models.AnulacionTr.findOne({ where });
    if (!row) {
      throw boom.notFound('Solicitud no encontrada');
    }
    if (row.estado !== 'pendiente') {
      throw boom.conflict('La solicitud ya fue procesada');
    }
    await row.update({ estado: 'aprobada' });
    const ingreso = await models.IngresoTr.findByPk(row.ingresoId);
    if (ingreso && ingreso.status !== 'anulado') {
      await ingreso.update({ status: 'anulado', numeroFactura: null });
    }
    return await this.findOne(id, companyId);
  }

  async reject(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const row = await models.AnulacionTr.findOne({ where });
    if (!row) {
      throw boom.notFound('Solicitud no encontrada');
    }
    if (row.estado !== 'pendiente') {
      throw boom.conflict('La solicitud ya fue procesada');
    }
    await row.update({ estado: 'rechazada' });
    return await this.findOne(id, companyId);
  }

  async delete(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const row = await models.AnulacionTr.findOne({ where });
    if (!row) {
      throw boom.notFound('Solicitud no encontrada');
    }
    await row.destroy();
    return { id };
  }
}

module.exports = AnulacionService;
