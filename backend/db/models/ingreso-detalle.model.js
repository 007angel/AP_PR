const { Model, DataTypes } = require('sequelize');

class IngresoDetalleTr extends Model {
  static associate(models) {
    this.belongsTo(models.IngresoTr, { foreignKey: 'ingreso_id', as: 'ingreso' });
    this.belongsTo(models.ArticuloTr, { foreignKey: 'articuloId', as: 'articuloRef' });
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

const IngresoDetalleTrSchema = {
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
  foto: {
    allowNull: true,
    type: DataTypes.TEXT,
    comment: 'Foto del articulo en base64 o URL'
  },
  articuloId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'articulo_id',
    references: {
      model: 'articulo_tr',
      key: 'id'
    }
  },
  companyId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'company_id',
    references: {
      model: 'company_tr',
      key: 'id'
    }
  },
  userId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: 'user_tr',
      key: 'id'
    }
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

module.exports = { IngresoDetalleTr, IngresoDetalleTrSchema };
