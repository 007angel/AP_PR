const {UserTr, UserTrSchema} = require('./user.model')

function setupModels(sequelize){
  UserTr.init(UserTrSchema,UserTr.config(sequelize))

}


module.exports= setupModels;
