const {UserTr, UserTrSchema} = require('./user.model')
const {CompanyTr, CompanyTrSchema} = require('./company.model')
const {IngresoTr, IngresoTrSchema} = require('./ingreso.model')
const {CorrelativoTr, CorrelativoTrSchema} = require('./correlativo.model')
const {IngresoDetalleTr, IngresoDetalleTrSchema} = require('./ingreso-detalle.model')

function setupModels(sequelize){
  UserTr.init(UserTrSchema,UserTr.config(sequelize))
  CompanyTr.init(CompanyTrSchema,CompanyTr.config(sequelize))
  IngresoTr.init(IngresoTrSchema,IngresoTr.config(sequelize))
  CorrelativoTr.init(CorrelativoTrSchema,CorrelativoTr.config(sequelize))
  IngresoDetalleTr.init(IngresoDetalleTrSchema,IngresoDetalleTr.config(sequelize))

  // Associations
  UserTr.associate(sequelize.models)
  CompanyTr.associate(sequelize.models)
  IngresoTr.associate(sequelize.models)
  CorrelativoTr.associate(sequelize.models)
  IngresoDetalleTr.associate(sequelize.models)
}

module.exports= setupModels;
