const {DataTypes, Sequelize, Model} = require('sequelize')

const COMPANY_TR_TABLE='company_tr'

const CompanyTrSchema={
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
  rif:{
    allowNull:false,
    type:DataTypes.STRING,
    unique:true
  },
  email:{
    allowNull:false,
    type:DataTypes.STRING,
    unique:true
  },
  phone:{
    allowNull:true,
    type:DataTypes.STRING
  },
  address:{
    allowNull:true,
    type:DataTypes.TEXT
  },
  city:{
    allowNull:true,
    type:DataTypes.STRING
  },
  state:{
    allowNull:true,
    type:DataTypes.STRING
  },
  country:{
    allowNull:true,
    type:DataTypes.STRING,
    defaultValue:'Venezuela'
  },
  logo:{
    allowNull:true,
    type:DataTypes.STRING
  },
  website:{
    allowNull:true,
    type:DataTypes.STRING
  },
  status:{
    allowNull:false,
    type:DataTypes.STRING,
    defaultValue:'active'
  },
  plan:{
    allowNull:false,
    type:DataTypes.STRING,
    defaultValue:'basic'
  },
  maxUsers:{
    allowNull:false,
    type:DataTypes.INTEGER,
    field:'max_users',
    defaultValue:5
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

class CompanyTr extends Model{
  static associate(models){
    this.hasMany(models.UserTr, { foreignKey: 'companyId', as: 'users' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName:COMPANY_TR_TABLE,
      modelName:'CompanyTr',
      timestamps:false
    }
  }
}

module.exports = {COMPANY_TR_TABLE,CompanyTrSchema,CompanyTr}
