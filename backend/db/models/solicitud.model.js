const { DataTypes, Sequelize, Model } = require('sequelize');

const SOLICITUD_TR_TABLE = 'solicitud_tr';

const SolicitudTrSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  correlativo: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  fecha: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  solicitante: {
    allowNull: false,
    type: DataTypes.STRING(200)
  },
  userId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: { model: 'user_tr', key: 'id' }
  },
  companyId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'company_id',
    references: { model: 'company_tr', key: 'id' }
  },
  clienteId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'cliente_id',
    references: { model: 'cliente_tr', key: 'id' }
  },
  estado: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'pendiente'
  },
  observaciones: {
    allowNull: true,
    type: DataTypes.TEXT
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

class SolicitudTr extends Model {
  static associate(models) {
    this.belongsTo(models.UserTr, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.CompanyTr, { foreignKey: 'companyId', as: 'company' });
    this.belongsTo(models.ClienteTr, { foreignKey: 'clienteId', as: 'cliente' });
    this.hasMany(models.SolicitudDetalleTr, { foreignKey: 'solicitudId', as: 'detalles' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SOLICITUD_TR_TABLE,
      modelName: 'SolicitudTr',
      timestamps: false
    };
  }
}

module.exports = { SOLICITUD_TR_TABLE, SolicitudTrSchema, SolicitudTr };
