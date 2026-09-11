const sequelize = require('../libs/sequelize')
const bcrypt = require('bcryptjs')

class CompanyTrService{
    constructor(){}

    async create(data){
        const newCompany = await sequelize.models.CompanyTr.create(data)
        return newCompany
    }

    async register(companyData, adminData){
        const transaction = await sequelize.transaction()
        try{
            const existingRif = await sequelize.models.CompanyTr.findOne({ where: { rif: companyData.rif }, transaction })
            if(existingRif){
                await transaction.rollback()
                return { error: 'El RIF ya esta registrado' }
            }

            const existingCompanyEmail = await sequelize.models.CompanyTr.findOne({ where: { email: companyData.email }, transaction })
            if(existingCompanyEmail){
                await transaction.rollback()
                return { error: 'El email de la empresa ya esta registrado' }
            }

            const existingAdminEmail = await sequelize.models.UserTr.findOne({ where: { email: adminData.email }, transaction })
            if(existingAdminEmail){
                await transaction.rollback()
                return { error: 'El email del administrador ya esta registrado' }
            }

            const newCompany = await sequelize.models.CompanyTr.create({
                ...companyData,
                status: 'active',
                plan: 'basic',
                maxUsers: 5
            }, { transaction })

            const hash = await bcrypt.hash(adminData.password, 10)
            const newAdmin = await sequelize.models.UserTr.create({
                name: adminData.name,
                email: adminData.email,
                password: hash,
                role: 'admin',
                modules: ['users', 'dashboard', 'reports', 'settings'],
                status: 'active',
                companyId: newCompany.id
            }, { transaction })

            await transaction.commit()

            const { password, ...adminWithoutPassword } = newAdmin.dataValues
            return { company: newCompany, admin: adminWithoutPassword }
        }catch(error){
            await transaction.rollback()
            throw error
        }
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
