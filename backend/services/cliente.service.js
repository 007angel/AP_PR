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

  async findOne(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const cliente = await sequelize.models.ClienteTr.findOne({ where, raw: true });
    return cliente;
  }

  async update(id, changes, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const cliente = await sequelize.models.ClienteTr.findOne({ where });
    if (!cliente) return null;
    await cliente.update(changes);
    return await this.findOne(id, companyId);
  }

  async delete(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const cliente = await sequelize.models.ClienteTr.findOne({ where });
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

  async getArticulosByCliente(clienteId, companyId) {
    const where = companyId ? { id: clienteId, companyId } : { id: clienteId };
    const cliente = await sequelize.models.ClienteTr.findOne({ where });
    if (!cliente) throw boom.notFound('Cliente no encontrado');
    const articulos = await cliente.getArticulos({ joinTableAttributes: [], raw: true, nest: true });
    return articulos;
  }

  async syncArticulos(clienteId, articuloIds, companyId) {
    const where = companyId ? { id: clienteId, companyId } : { id: clienteId };
    const cliente = await sequelize.models.ClienteTr.findOne({ where });
    if (!cliente) throw boom.notFound('Cliente no encontrado');
    await cliente.setArticulos(articuloIds);
    return await this.getArticulosByCliente(clienteId, companyId);
  }
}

module.exports = ClienteService;
