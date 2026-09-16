const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');

class IngresoDetalleTrService {
  async getTarimasUsadas(ingresoId, excludeId = null) {
    const detalles = await sequelize.models.IngresoDetalleTr.findAll({
      where: { ingreso_id: ingresoId },
      raw: true
    });
    return detalles
      .filter(d => !(excludeId && d.id === excludeId))
      .reduce((sum, d) => sum + (d.tarima || 0), 0);
  }

  async syncIngresoStatus(ingresoId) {
    const ingreso = await sequelize.models.IngresoTr.findByPk(ingresoId);
    if (!ingreso) return;
    const usadas = await this.getTarimasUsadas(ingresoId);
    const total = ingreso.cantidadTarimas || 0;
    const status = (total > 0 && usadas >= total) ? 'completado' : 'pendiente';
    if (ingreso.status !== status) {
      await ingreso.update({ status });
    }
  }

  async create(data) {
    const ingreso = await sequelize.models.IngresoTr.findByPk(data.ingreso_id);
    if (!ingreso) {
      throw boom.notFound('Ingreso no encontrado');
    }
    if (ingreso.status === 'completado') {
      throw boom.conflict('El ingreso esta completo, no se permiten mas lineas');
    }
    const usadas = await this.getTarimasUsadas(data.ingreso_id);
    const disponibles = (ingreso.cantidadTarimas || 0) - usadas;
    if ((data.tarima || 0) > disponibles) {
      throw boom.badRequest(`No hay suficientes tarimas. Disponibles: ${disponibles}`);
    }
    const newDetalle = await sequelize.models.IngresoDetalleTr.create(data);
    await this.syncIngresoStatus(data.ingreso_id);
    return newDetalle;
  }

  async find() {
    const detalles = await sequelize.models.IngresoDetalleTr.findAll({ raw: true });
    return detalles;
  }

  async findOne(id) {
    const detalle = await sequelize.models.IngresoDetalleTr.findByPk(id, { raw: true });
    return detalle;
  }

  async findByIngreso(ingresoId) {
    const detalles = await sequelize.models.IngresoDetalleTr.findAll({
      where: { ingreso_id: ingresoId },
      raw: true
    });
    return detalles;
  }

  async update(id, changes) {
    const existing = await sequelize.models.IngresoDetalleTr.findByPk(id);
    if (!existing) return null;
    const ingreso = await sequelize.models.IngresoTr.findByPk(existing.ingreso_id);
    if (ingreso && ingreso.status === 'completado') {
      throw boom.conflict('El ingreso esta completo, no se permiten modificaciones');
    }
    if (changes.tarima !== undefined && ingreso) {
      const usadas = await this.getTarimasUsadas(existing.ingreso_id, id);
      const disponibles = (ingreso.cantidadTarimas || 0) - usadas;
      if (changes.tarima > disponibles) {
        throw boom.badRequest(`No hay suficientes tarimas. Disponibles: ${disponibles}`);
      }
    }
    await existing.update(changes);
    await this.syncIngresoStatus(existing.ingreso_id);
    return await this.findOne(id);
  }

  async delete(id) {
    const detalle = await sequelize.models.IngresoDetalleTr.findByPk(id);
    if (!detalle) return null;
    const ingreso = await sequelize.models.IngresoTr.findByPk(detalle.ingreso_id);
    if (ingreso && ingreso.status === 'completado') {
      throw boom.conflict('El estado completado no permite la eliminacion, contacte a su supervisor');
    }
    const ingresoId = detalle.ingreso_id;
    await detalle.destroy();
    await this.syncIngresoStatus(ingresoId);
    return { id };
  }

  async deleteByIngreso(ingresoId) {
    await sequelize.models.IngresoDetalleTr.destroy({
      where: { ingreso_id: ingresoId }
    });
    return { deleted: true };
  }
}

module.exports = IngresoDetalleTrService;
