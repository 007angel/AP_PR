const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class ModuloService {
  async find() {
    return await models.ModuloTr.findAll({ order: [['orden', 'ASC'], ['id', 'ASC']] });
  }

  async findActivos() {
    return await models.ModuloTr.findAll({
      where: { activo: true },
      order: [['orden', 'ASC'], ['id', 'ASC']]
    });
  }

  async findOne(id) {
    const modulo = await models.ModuloTr.findByPk(id);
    if (!modulo) {
      throw boom.notFound('Modulo no encontrado');
    }
    return modulo;
  }

  async create(data) {
    return await models.ModuloTr.create(data);
  }

  async update(id, changes) {
    const modulo = await this.findOne(id);
    return await modulo.update(changes);
  }

  async delete(id) {
    const modulo = await this.findOne(id);
    await modulo.destroy();
    return { id };
  }
}

module.exports = ModuloService;
