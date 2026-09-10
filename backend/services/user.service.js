const bcrypt = require('bcryptjs');
const sequelize = require('../libs/sequelize')

class UserTrService{
    constructor(){}

    async create(data){
        const hash = await bcrypt.hash(data.password, 10);
        const newUser = await sequelize.models.UserTr.create({
            ...data,
            password: hash
        })
        return newUser
    }

    async find(){
        const users = await sequelize.models.UserTr.findAll({ raw: true })
        return users.map(({ password, ...rest }) => rest)
    }

    async findOne(id){
        const user = await sequelize.models.UserTr.findByPk(id, { raw: true })
        if(!user) return null
        const { password, ...rest } = user
        return rest
    }

    async findByEmail(email){
        const user = await sequelize.models.UserTr.findOne({ where: { email }, raw: true })
        return user
    }

    async update(id, changes){
        const existing = await sequelize.models.UserTr.findByPk(id)
        if(!existing) return null
        if(changes.password){
            changes.password = await bcrypt.hash(changes.password, 10);
        }
        await existing.update(changes)
        const updated = await this.findOne(id)
        return updated
    }

    async delete(id){
        const user = await sequelize.models.UserTr.findByPk(id)
        if(!user) return null
        await user.destroy()
        return { id }
    }

    async comparePasswords(plain, hash){
        return await bcrypt.compare(plain, hash)
    }

    async resetPassword(email){
        const user = await sequelize.models.UserTr.findOne({ where: { email } })
        if(!user) return null
        const tempPassword = 'Temp' + Math.random().toString(36).slice(-8) + '!';
        const hash = await bcrypt.hash(tempPassword, 10);
        await user.update({ password: hash })
        return { email, tempPassword }
    }

    async updateModules(id, modules){
        const user = await sequelize.models.UserTr.findByPk(id)
        if(!user) return null
        await user.update({ modules })
        return await this.findOne(id)
    }
}

module.exports=UserTrService
