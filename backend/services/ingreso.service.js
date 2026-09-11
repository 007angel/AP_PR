const sequelize = require('../libs/sequelize')
const CorrelativoTrService = require('./correlativo.service')

class IngresoTrService{
    constructor(){
        this.correlativoService = new CorrelativoTrService()
    }

    async create(data){
        const newIngreso = await sequelize.models.IngresoTr.create(data)
        return newIngreso
    }

    async find(){
        const ingresos = await sequelize.models.IngresoTr.findAll({ raw: true })
        return ingresos
    }

    async findOne(id){
        const ingreso = await sequelize.models.IngresoTr.findByPk(id, { raw: true })
        return ingreso
    }

    async findByCorrelativo(correlativo){
        const ingreso = await sequelize.models.IngresoTr.findOne({ where: { correlativo }, raw: true })
        return ingreso
    }

    async update(id, changes){
        const existing = await sequelize.models.IngresoTr.findByPk(id)
        if(!existing) return null
        await existing.update(changes)
        return await this.findOne(id)
    }

    async delete(id){
        const ingreso = await sequelize.models.IngresoTr.findByPk(id)
        if(!ingreso) return null
        await ingreso.destroy()
        return { id }
    }

    async findByCompany(companyId){
        const ingresos = await sequelize.models.IngresoTr.findAll({ 
            where: { companyId: companyId },
            raw: true
        })
        return ingresos
    }

    async generateCorrelativo(companyId){
        return await this.correlativoService.generateCorrelativo(companyId, 'ingreso', 'ING')
    }
}

module.exports=IngresoTrService
