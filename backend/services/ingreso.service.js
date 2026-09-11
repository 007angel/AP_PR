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

    async findRecent(limit = 5){
        const ingresos = await sequelize.models.IngresoTr.findAll({ 
            order: [['id', 'DESC']],
            limit: limit,
            raw: true
        })
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

    async getStats(){
        const total = await sequelize.models.IngresoTr.count()
        const pendientes = await sequelize.models.IngresoTr.count({ where: { status: 'pendiente' } })
        const completados = await sequelize.models.IngresoTr.count({ where: { status: 'completado' } })
        const cancelados = await sequelize.models.IngresoTr.count({ where: { status: 'cancelado' } })
        
        const result = await sequelize.models.IngresoTr.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('cantidad_tarimas')), 'totalTarimas']
            ],
            raw: true
        })
        const totalTarimas = result[0]?.totalTarimas || 0

        return {
            total,
            pendientes,
            completados,
            cancelados,
            totalTarimas: parseInt(totalTarimas)
        }
    }
}

module.exports=IngresoTrService
