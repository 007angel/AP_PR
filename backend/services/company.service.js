const sequelize = require('../libs/sequelize')

class CompanyTrService{
    constructor(){}

    async create(data){
        const newCompany = await sequelize.models.CompanyTr.create(data)
        return newCompany
    }

    async find(){
        const companies = await sequelize.models.CompanyTr.findAll({ raw: true })
        return companies
    }

    async findOne(id){
        const company = await sequelize.models.CompanyTr.findByPk(id, { raw: true })
        return company
    }

    async findByRif(rif){
        const company = await sequelize.models.CompanyTr.findOne({ where: { rif }, raw: true })
        return company
    }

    async findByEmail(email){
        const company = await sequelize.models.CompanyTr.findOne({ where: { email }, raw: true })
        return company
    }

    async update(id, changes){
        const existing = await sequelize.models.CompanyTr.findByPk(id)
        if(!existing) return null
        await existing.update(changes)
        return await this.findOne(id)
    }

    async delete(id){
        const company = await sequelize.models.CompanyTr.findByPk(id)
        if(!company) return null
        await company.destroy()
        return { id }
    }

    async getUsers(companyId){
        const users = await sequelize.models.UserTr.findAll({ 
            where: { companyId: companyId }
        })
        return users.map(user => {
            const { password, ...rest } = user.dataValues
            return rest
        })
    }

    async linkUser(companyId, userId){
        const user = await sequelize.models.UserTr.findByPk(userId)
        if(!user) return null
        await user.update({ companyId: companyId })
        const { password, ...rest } = user.dataValues
        return rest
    }

    async unlinkUser(userId){
        const user = await sequelize.models.UserTr.findByPk(userId)
        if(!user) return null
        await user.update({ companyId: null })
        const { password, ...rest } = user.dataValues
        return rest
    }
}

module.exports=CompanyTrService
