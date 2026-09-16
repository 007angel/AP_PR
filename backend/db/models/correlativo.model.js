const {DataTypes, Sequelize, Model} = require('sequelize')

const CORRELATIVO_TR_TABLE='correlativo_tr'

const CorrelativoTrSchema={
  id:{
    allowNull:false,
    autoIncrement:true,
    primaryKey:true,
    type:DataTypes.INTEGER
  },
  tipo:{
    allowNull:false,
    type:DataTypes.STRING(10),
    comment:'Codigo corto del documento: ing, fac, sal, sol'
  },
  codEmpresa:{
    allowNull:false,
    type:DataTypes.INTEGER,
    field:'cod_empresa',
    references:{
      model:'company_tr',
      key:'id'
    }
  },
  numero:{
    allowNull:false,
    type:DataTypes.INTEGER,
    defaultValue:0,
    comment:'Ultimo numero utilizado'
  },
  descripcion:{
    allowNull:true,
    type:DataTypes.STRING(100)
  },
  fecha:{
    allowNull:true,
    type:DataTypes.DATEONLY,
    comment:'Fecha de la ultima generacion'
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
    this.belongsTo(models.CompanyTr, { foreignKey: 'codEmpresa', as: 'company' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName:CORRELATIVO_TR_TABLE,
      modelName:'CorrelativoTr',
      timestamps:false,
      indexes:[
        {
          unique:true,
          fields:['tipo','cod_empresa']
        }
      ]
    }
  }
}

module.exports = {CORRELATIVO_TR_TABLE,CorrelativoTrSchema,CorrelativoTr}
