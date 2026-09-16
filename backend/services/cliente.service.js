const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');

class ClienteService {
  async create(data) {
    const existing = await sequelize.models.ClienteTr.findOne({
      where: { nombre: data.nombre, companyId: data.companyId || null }
    });
    if (existing) {
      throw boom.conflict('Ya existe un cliente con ese nombre en esta empresa');
    }
    const cliente = await sequelize.models.ClienteTr.create(data);
    return cliente;
  }

  async find(filters = {}) {
    const where = {};
    if (filters.companyId) where.companyId = filters.companyId;
    const clientes = await sequelize.models.ClienteTr.findAll({
      where,
      order: [['nombre', 'ASC']],
      raw: true
    });
    return clientes;
  }

  async findOne(id) {
    const cliente = await sequelize.models.ClienteTr.findByPk(id, { raw: true });
    return cliente;
  }

  async update(id, changes) {
    const cliente = await sequelize.models.ClienteTr.findByPk(id);
    if (!cliente) return null;
    await cliente.update(changes);
    return await this.findOne(id);
  }

  async delete(id) {
    const cliente = await sequelize.models.ClienteTr.findByPk(id);
    if (!cliente) return null;
    await cliente.destroy();
    return { id };
  }

  async search(term, companyId) {
    const where = {};
    if (companyId) where.companyId = companyId;
    const clientes = await sequelize.models.ClienteTr.findAll({
      where,
      order: [['nombre', 'ASC']],
      raw: true
    });
    if (!term) return clientes;
    const lower = term.toLowerCase();
    return clientes.filter(c =>
      (c.nombre && c.nombre.toLowerCase().includes(lower)) ||
      (c.rif && c.rif.toLowerCase().includes(lower)) ||
      (c.email && c.email.toLowerCase().includes(lower))
    );
  }
}

module.exports = ClienteService;
