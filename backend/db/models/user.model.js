const {DataTypes, Sequelize, Model} = require('sequelize')

const USER_TR_TABLE='user_tr'

const UserTrSchema={
  id:{
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
    type:DataTypes.INTEGER
  },
  name:{
    allowNull:false,
    type:DataTypes.STRING
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
  role:{
    allowNull:false,
    type:DataTypes.STRING,
    defaultValue:'user'
  },
  modules:{
    allowNull:true,
    type:DataTypes.JSON,
    defaultValue:[]
  },
  status:{
    allowNull:false,
    type:DataTypes.STRING,
    defaultValue:'active'
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

class UserTr extends Model{
  static associate(){

  }

  static config(sequelize){
    return {
      sequelize,
      tableName:USER_TR_TABLE,
      modelName:'UserTr',
      timestamps:false
    }
  }
}

module.exports = {USER_TR_TABLE,UserTrSchema,UserTr}
