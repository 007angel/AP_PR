const { UserTr } = require('../db/models/user.model');
const { models } = require('../libs/sequelize')

class UserTrService{
    constructor(){}

        async create(data){
            const newUser = await models.UserTr.create(data)
            return newUser
        }

        async findOne(id){
            const user = await models.UserTr.findByPk(id)
            return user
        }
}




module.exports=UserTrService
