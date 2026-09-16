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
  companyId:{
    allowNull:true,
    type:DataTypes.INTEGER,
    field:'company_id',
    references:{
      model:'company_tr',
      key:'id'
    }
  },
  codigo:{
    allowNull:true,
    type:DataTypes.STRING,
    unique:true
  },
  createdByCompanyId:{
    allowNull:true,
    type:DataTypes.INTEGER,
    field:'created_by_company_id',
    references:{
      model:'company_tr',
      key:'id'
    }
  },
  idUsuarioMaster:{
    allowNull:true,
    type:DataTypes.INTEGER,
    field:'id_usuario_master',
    references:{
      model:'user_tr',
      key:'id'
    }
  },
  idEmpresaMaster:{
    allowNull:true,
    type:DataTypes.INTEGER,
    field:'id_empresa_master',
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

class UserTr extends Model{
  static associate(models){
    this.belongsTo(models.CompanyTr, { foreignKey: 'companyId', as: 'company' })
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
