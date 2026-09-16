const { DataTypes, Sequelize, Model } = require('sequelize');

const CLIENTE_TR_TABLE = 'cliente_tr';

const ClienteTrSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(200)
  },
  email: {
    allowNull: true,
    type: DataTypes.STRING(200)
  },
  telefono: {
    allowNull: true,
    type: DataTypes.STRING(50)
  },
  direccion: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  rif: {
    allowNull: true,
    type: DataTypes.STRING(30)
  },
  contacto: {
    allowNull: true,
    type: DataTypes.STRING(200)
  },
  observaciones: {
    allowNull: true,
    type: DataTypes.TEXT
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

class ClienteTr extends Model {
  static associate(models) {
    this.belongsTo(models.CompanyTr, { foreignKey: 'companyId', as: 'company' });
    this.belongsTo(models.UserTr, { foreignKey: 'userId', as: 'user' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CLIENTE_TR_TABLE,
      modelName: 'ClienteTr',
      timestamps: false
    };
  }
}

module.exports = { CLIENTE_TR_TABLE, ClienteTrSchema, ClienteTr };
