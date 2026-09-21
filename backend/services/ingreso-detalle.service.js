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

  async find(companyId) {
    const where = companyId ? { companyId } : {};
    const detalles = await sequelize.models.IngresoDetalleTr.findAll({
      where,
      include: [{ model: sequelize.models.ArticuloTr, as: 'articuloRef', attributes: ['id', 'codigo', 'nombre', 'unidad', 'foto'] }],
      raw: true,
      nest: true
    });
    return detalles.map(d => ({
      ...d,
      articulo: (d.articuloRef && d.articuloRef.nombre) || d.articulo
    }));
  }

  async findOne(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const detalle = await sequelize.models.IngresoDetalleTr.findOne({
      where,
      include: [{ model: sequelize.models.ArticuloTr, as: 'articuloRef', attributes: ['id', 'codigo', 'nombre', 'unidad', 'foto'] }],
      raw: true,
      nest: true
    });
    if (!detalle) return null;
    return {
      ...detalle,
      articulo: (detalle.articuloRef && detalle.articuloRef.nombre) || detalle.articulo
    };
  }

  async findByIngreso(ingresoId, companyId) {
    const ingresoWhere = companyId ? { id: ingresoId, companyId } : { id: ingresoId };
    const ingreso = await sequelize.models.IngresoTr.findOne({ where: ingresoWhere });
    if (!ingreso) return [];
    const detalles = await sequelize.models.IngresoDetalleTr.findAll({
      where: { ingreso_id: ingresoId },
      include: [{ model: sequelize.models.ArticuloTr, as: 'articuloRef', attributes: ['id', 'codigo', 'nombre', 'unidad', 'foto'] }],
      raw: true,
      nest: true
    });

    // Sync solicitado and entregado from solicitud_detalle_tr
    const detalleIds = detalles.map(d => d.id);
    if (detalleIds.length > 0) {
      const [solicitudes] = await sequelize.query(`
        SELECT
          ingreso_detalle_id AS "detalleId",
          COALESCE(SUM(cantidad_solicitada), 0) AS "totalSolicitado",
          COALESCE(SUM(cantidad_entregada), 0) AS "totalEntregado"
        FROM solicitud_detalle_tr
        WHERE ingreso_detalle_id IN (:ids)
        GROUP BY ingreso_detalle_id
      `, { replacements: { ids: detalleIds } });

      const solMap = {};
      for (const s of solicitudes) {
        solMap[s.detalleId] = s;
      }

      // Update DB and return computed values
      for (const d of detalles) {
        const sol = solMap[d.id];
        if (sol) {
          const nuevoSolicitado = parseInt(sol.totalSolicitado) || 0;
          const nuevoEntregado = parseInt(sol.totalEntregado) || 0;
          if (d.solicitado !== nuevoSolicitado || d.entregado !== nuevoEntregado) {
            await sequelize.models.IngresoDetalleTr.update(
              { solicitado: nuevoSolicitado, entregado: nuevoEntregado },
              { where: { id: d.id } }
            );
            d.solicitado = nuevoSolicitado;
            d.entregado = nuevoEntregado;
          }
        }
      }
    }

    return detalles.map(d => ({
      ...d,
      articulo: (d.articuloRef && d.articuloRef.nombre) || d.articulo
    }));
  }

  async update(id, changes, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const existing = await sequelize.models.IngresoDetalleTr.findOne({ where });
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
    const updated = await sequelize.models.IngresoDetalleTr.findByPk(id, {
      include: [{ model: sequelize.models.ArticuloTr, as: 'articuloRef', attributes: ['id', 'codigo', 'nombre', 'unidad', 'foto'] }],
      raw: true, nest: true
    });
    return { ...updated, articulo: (updated.articuloRef && updated.articuloRef.nombre) || updated.articulo };
  }

  async delete(id, companyId) {
    const where = companyId ? { id, companyId } : { id };
    const detalle = await sequelize.models.IngresoDetalleTr.findOne({ where });
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

  async deleteByIngreso(ingresoId, companyId) {
    const ingresoWhere = companyId ? { id: ingresoId, companyId } : { id: ingresoId };
    const ingreso = await sequelize.models.IngresoTr.findOne({ where: ingresoWhere });
    if (!ingreso) return null;
    await sequelize.models.IngresoDetalleTr.destroy({
      where: { ingreso_id: ingresoId }
    });
    return { deleted: true };
  }
}

module.exports = IngresoDetalleTrService;
