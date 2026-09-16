const { DataTypes, Sequelize, Model } = require('sequelize');

const ARTICULO_TR_TABLE = 'articulo_tr';

const ArticuloTrSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  codigo: {
    allowNull: true,
    type: DataTypes.STRING(50)
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(200)
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  unidad: {
    allowNull: true,
    type: DataTypes.STRING(30),
    defaultValue: 'UNIDAD'
  },
  precio: {
    allowNull: true,
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  foto: {
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

class ArticuloTr extends Model {
  static associate(models) {
    this.belongsTo(models.CompanyTr, { foreignKey: 'companyId', as: 'company' });
    this.belongsTo(models.UserTr, { foreignKey: 'userId', as: 'user' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ARTICULO_TR_TABLE,
      modelName: 'ArticuloTr',
      timestamps: false
    };
  }
}

module.exports = { ARTICULO_TR_TABLE, ArticuloTrSchema, ArticuloTr };
