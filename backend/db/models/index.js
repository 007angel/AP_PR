const {UserTr, UserTrSchema} = require('./user.model')
const {CompanyTr, CompanyTrSchema} = require('./company.model')
const {IngresoTr, IngresoTrSchema} = require('./ingreso.model')

function setupModels(sequelize){
  UserTr.init(UserTrSchema,UserTr.config(sequelize))
  CompanyTr.init(CompanyTrSchema,CompanyTr.config(sequelize))
  IngresoTr.init(IngresoTrSchema,IngresoTr.config(sequelize))

  // Associations
  UserTr.associate(sequelize.models)
  CompanyTr.associate(sequelize.models)
  IngresoTr.associate(sequelize.models)
}

module.exports= setupModels;
