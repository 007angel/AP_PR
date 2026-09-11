const sequelize = require('../libs/sequelize');

class IngresoDetalleTrService {
  async create(data) {
    const newDetalle = await sequelize.models.IngresoDetalleTr.create(data);
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
    await existing.update(changes);
    return await this.findOne(id);
  }

  async delete(id) {
    const detalle = await sequelize.models.IngresoDetalleTr.findByPk(id);
    if (!detalle) return null;
    await detalle.destroy();
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
