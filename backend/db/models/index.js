const {UserTr, UserTrSchema} = require('./user.model')
const {CompanyTr, CompanyTrSchema} = require('./company.model')

function setupModels(sequelize){
  UserTr.init(UserTrSchema,UserTr.config(sequelize))
  CompanyTr.init(CompanyTrSchema,CompanyTr.config(sequelize))

  // Associations
  UserTr.associate(sequelize.models)
  CompanyTr.associate(sequelize.models)
}

module.exports= setupModels;
