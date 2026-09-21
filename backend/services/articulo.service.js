const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');

class ArticuloService {
  async create(data) {
    if (data.codigo) {
      const existing = await sequelize.models.ArticuloTr.findOne({
        where: { codigo: data.codigo, companyId: data.companyId || null }
      });
      if (existing) {
        throw boom.conflict('Ya existe un artículo con ese código en esta empresa');
      }
    }
    const articulo = await sequelize.models.ArticuloTr.create(data);
    return articulo;
  }

  async find(filters = {}) {
    const where = {};
    if (filters.companyId) where.companyId = filters.companyId;
    const articulos = await sequelize.models.ArticuloTr.findAll({
      where,
      order: [['nombre', 'ASC']],
      raw: true
    });
    return articulos;
  }

  async findOne(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const articulo = await sequelize.models.ArticuloTr.findOne({ where, raw: true });
    return articulo;
  }

  async update(id, changes, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const articulo = await sequelize.models.ArticuloTr.findOne({ where });
    if (!articulo) return null;
    if (changes.codigo && changes.codigo !== articulo.codigo) {
      const existing = await sequelize.models.ArticuloTr.findOne({
        where: { codigo: changes.codigo, companyId: articulo.companyId }
      });
      if (existing && existing.id !== id) {
        throw boom.conflict('Ya existe un artículo con ese código en esta empresa');
      }
    }
    await articulo.update(changes);
    return await this.findOne(id, companyId);
  }

  async delete(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const articulo = await sequelize.models.ArticuloTr.findOne({ where });
    if (!articulo) return null;
    await articulo.destroy();
    return { id };
  }

  async search(term, companyId) {
    const where = {};
    if (companyId) where.companyId = companyId;
    const articulos = await sequelize.models.ArticuloTr.findAll({
      where,
      order: [['nombre', 'ASC']],
      raw: true
    });
    if (!term) return articulos;
    const lower = term.toLowerCase();
    return articulos.filter(a =>
      (a.nombre && a.nombre.toLowerCase().includes(lower)) ||
      (a.codigo && a.codigo.toLowerCase().includes(lower)) ||
      (a.descripcion && a.descripcion.toLowerCase().includes(lower))
    );
  }
}

module.exports = ArticuloService;
