const {DataTypes, Sequelize, Model} = require('sequelize')
//const sequelize = require('../../libs/sequelize')

//dd

const USER_TR_TABLE='user_tr'

const UserTrSchema={
  id:{
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
    type:DataTypes.INTEGER
  },
  email:{
    allowNull:false,
    type:DataTypes.STRING,
    unique:true
  },
  password:{
    allowNull:false,
    type:DataTypes.STRING
  },
  creatAT:{
    allowNull:false,
    type:DataTypes.DATE,
    field:'create_dt',
    defaultValue : Sequelize.NOW
  }
}

class UserTr extends Model{
  static associate(){

  }

  static config(sequelize){
    return {
      sequelize,
      tableName:USER_TR_TABLE,
      ModelName:'UserTr',
      timestamps:false
    }
  }
}

module.exports = {USER_TR_TABLE,UserTrSchema,UserTr}
