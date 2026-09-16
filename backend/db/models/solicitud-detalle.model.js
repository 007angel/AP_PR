const { DataTypes, Sequelize, Model } = require('sequelize');

const SOLICITUD_DETALLE_TR_TABLE = 'solicitud_detalle_tr';

const SolicitudDetalleTrSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  solicitudId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'solicitud_id',
    references: { model: 'solicitud_tr', key: 'id' }
  },
  articulo: {
    allowNull: false,
    type: DataTypes.STRING(200)
  },
  cantidadSolicitada: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'cantidad_solicitada'
  },
  cantidadEntregada: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'cantidad_entregada',
    defaultValue: 0
  },
  ingresoId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'ingreso_id',
    references: { model: 'ingreso_tr', key: 'id' }
  },
  ingresoDetalleId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'ingreso_detalle_id',
    references: { model: 'ingreso_detalle_tr', key: 'id' }
  },
  lote: {
    allowNull: true,
    type: DataTypes.STRING(50)
  },
  companyId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'company_id',
    references: { model: 'company_tr', key: 'id' }
  },
  userId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: { model: 'user_tr', key: 'id' }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW
  }
};

class SolicitudDetalleTr extends Model {
  static associate(models) {
    this.belongsTo(models.SolicitudTr, { foreignKey: 'solicitudId', as: 'solicitud' });
    this.belongsTo(models.IngresoTr, { foreignKey: 'ingresoId', as: 'ingreso' });
    this.belongsTo(models.IngresoDetalleTr, { foreignKey: 'ingresoDetalleId', as: 'ingresoDetalle' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SOLICITUD_DETALLE_TR_TABLE,
      modelName: 'SolicitudDetalleTr',
      timestamps: false
    };
  }
}

module.exports = { SOLICITUD_DETALLE_TR_TABLE, SolicitudDetalleTrSchema, SolicitudDetalleTr };
