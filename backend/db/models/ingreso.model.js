const {DataTypes, Sequelize, Model} = require('sequelize')

const INGRESO_TR_TABLE='ingreso_tr'

const IngresoTrSchema={
  id:{
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
    type:DataTypes.INTEGER
  },
  correlativo:{
    allowNull:false,
    type:DataTypes.STRING,
    unique:true
  },
  numeroFactura:{
    allowNull:false,
    type:DataTypes.STRING,
    field:'numero_factura'
  },
  fechaIngreso:{
    allowNull:false,
    type:DataTypes.DATE,
    field:'fecha_ingreso'
  },
  fechaDigitacion:{
    allowNull:false,
    type:DataTypes.DATE,
    field:'fecha_digitacion'
  },
  cantidadTarimas:{
    allowNull:false,
    type:DataTypes.INTEGER,
    field:'cantidad_tarimas',
    defaultValue:0
  },
  usuarioDigito:{
    allowNull:false,
    type:DataTypes.STRING,
    field:'usuario_digito'
  },
  proveedor:{
    allowNull:true,
    type:DataTypes.STRING
  },
  observaciones:{
    allowNull:true,
    type:DataTypes.TEXT
  },
  status:{
    allowNull:false,
    type:DataTypes.STRING,
    defaultValue:'pendiente'
  },
  companyId:{
    allowNull:true,
    type:DataTypes.INTEGER,
    field:'company_id'
  },
  userId:{
    allowNull:true,
    type:DataTypes.INTEGER,
    field:'user_id'
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

class IngresoTr extends Model{
  static associate(models){
    this.belongsTo(models.CompanyTr, { foreignKey: 'companyId', as: 'company' })
    this.belongsTo(models.UserTr, { foreignKey: 'userId', as: 'user' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName:INGRESO_TR_TABLE,
      modelName:'IngresoTr',
      timestamps:false
    }
  }
}

module.exports = {INGRESO_TR_TABLE,IngresoTrSchema,IngresoTr}
