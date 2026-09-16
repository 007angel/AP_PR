const {DataTypes, Sequelize, Model} = require('sequelize')

const MODULO_TR_TABLE='modulo_tr'

const ModuloTrSchema={
  id:{
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
    type:DataTypes.INTEGER
  },
  nombre:{
    allowNull:false,
    type:DataTypes.STRING,
    unique:true
  },
  ruta:{
    allowNull:false,
    type:DataTypes.STRING
  },
  icono:{
    allowNull:true,
    type:DataTypes.STRING,
    defaultValue:'📦'
  },
  orden:{
    allowNull:false,
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  seccion:{
    allowNull:true,
    type:DataTypes.STRING
  },
  activo:{
    allowNull:false,
    type:DataTypes.BOOLEAN,
    defaultValue:true
  },
  descripcion:{
    allowNull:true,
    type:DataTypes.TEXT
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

class ModuloTr extends Model{
  static associate(models){
  }

  static config(sequelize){
    return {
      sequelize,
      tableName:MODULO_TR_TABLE,
      modelName:'ModuloTr',
      timestamps:false
    }
  }
}

module.exports = {MODULO_TR_TABLE,ModuloTrSchema,ModuloTr}
