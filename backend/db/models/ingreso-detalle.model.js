const { Model, DataTypes } = require('sequelize');

class IngresoDetalleTr extends Model {
  static associate(models) {
    this.belongsTo(models.IngresoTr, { foreignKey: 'ingreso_id', as: 'ingreso' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: 'ingreso_detalle_tr',
      modelName: 'IngresoDetalleTr',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    };
  }
}

const schema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  ingreso_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'ingreso_tr',
      key: 'id'
    }
  },
  lote: {
    allowNull: false,
    type: DataTypes.STRING(50)
  },
  articulo: {
    allowNull: false,
    type: DataTypes.STRING(200)
  },
  tarima: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  caja: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  unidad: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalIngreso: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_ingreso'
  },
  solicitado: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  entregado: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  mermas: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  devolucion: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  costoIndividual: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'costo_individual'
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
};

module.exports = { IngresoDetalleTr, schema };
