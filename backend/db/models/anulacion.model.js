const {DataTypes, Sequelize, Model} = require('sequelize')

const ANULACION_TR_TABLE='anulacion_tr'

const AnulacionTrSchema={
  id:{
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
    type:DataTypes.INTEGER
  },
  ingresoId:{
    allowNull:false,
    type:DataTypes.INTEGER,
    field:'ingreso_id',
    references:{
      model:'ingreso_tr',
      key:'id'
    }
  },
  motivo:{
    allowNull:true,
    type:DataTypes.TEXT
  },
  solicitadoPor:{
    allowNull:true,
    type:DataTypes.INTEGER,
    field:'solicitado_por',
    references:{
      model:'user_tr',
      key:'id'
    }
  },
  estado:{
    allowNull:false,
    type:DataTypes.STRING,
    defaultValue:'pendiente'
  },
  companyId:{
    allowNull:true,
    type:DataTypes.INTEGER,
    field:'company_id',
    references:{
      model:'company_tr',
      key:'id'
    }
  },
  createdAt:{
    allowNull:false,
    type:DataTypes.DATE,
    field:'created_at',
    defaultValue : Sequelize.NOW
  },
  updatedAt:{
    allowNull:true,
    type:DataTypes.DATE,
    field:'updated_at',
    defaultValue : Sequelize.NOW
  }
}

class AnulacionTr extends Model{
  static associate(models){
    this.belongsTo(models.IngresoTr, { foreignKey: 'ingresoId', as: 'ingreso' })
    this.belongsTo(models.UserTr, { foreignKey: 'solicitadoPor', as: 'solicitante' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName:ANULACION_TR_TABLE,
      modelName:'AnulacionTr',
      timestamps:false
    }
  }
}

module.exports = {ANULACION_TR_TABLE,AnulacionTrSchema,AnulacionTr}
