const { Model, DataTypes } = require('sequelize');

const CLIENTE_ARTICULO_TR_TABLE = 'cliente_articulo_tr';

const ClienteArticuloTrSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  clienteId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'cliente_id',
    references: { model: 'cliente_tr', key: 'id' }
  },
  articuloId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'articulo_id',
    references: { model: 'articulo_tr', key: 'id' }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  }
};

class ClienteArticuloTr extends Model {
  static associate(models) {
    this.belongsTo(models.ClienteTr, { foreignKey: 'clienteId', as: 'cliente' });
    this.belongsTo(models.ArticuloTr, { foreignKey: 'articuloId', as: 'articulo' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CLIENTE_ARTICULO_TR_TABLE,
      modelName: 'ClienteArticuloTr',
      timestamps: false
    };
  }
}

module.exports = { CLIENTE_ARTICULO_TR_TABLE, ClienteArticuloTrSchema, ClienteArticuloTr };
