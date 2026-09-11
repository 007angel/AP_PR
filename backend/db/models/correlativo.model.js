const {DataTypes, Sequelize, Model} = require('sequelize')

const CORRELATIVO_TR_TABLE='correlativo_tr'

const CorrelativoTrSchema={
  id:{
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
    type:DataTypes.INTEGER
  },
  companyId:{
    allowNull:false,
    type:DataTypes.INTEGER,
    field:'company_id'
  },
  tipo:{
    allowNull:false,
    type:DataTypes.STRING
  },
  prefijo:{
    allowNull:false,
    type:DataTypes.STRING
  },
  ultimoNumero:{
    allowNull:false,
    type:DataTypes.INTEGER,
    field:'ultimo_numero',
    defaultValue:0
  },
  descripcion:{
    allowNull:true,
    type:DataTypes.STRING
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

class CorrelativoTr extends Model{
  static associate(models){
    this.belongsTo(models.CompanyTr, { foreignKey: 'companyId', as: 'company' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName:CORRELATIVO_TR_TABLE,
      modelName:'CorrelativoTr',
      timestamps:false
    }
  }
}

module.exports = {CORRELATIVO_TR_TABLE,CorrelativoTrSchema,CorrelativoTr}
