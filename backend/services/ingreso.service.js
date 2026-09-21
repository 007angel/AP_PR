const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize')
const CorrelativoTrService = require('./correlativo.service')

class IngresoTrService{
    constructor(){
        this.correlativoService = new CorrelativoTrService()
    }

    async create(data){
        const newIngreso = await sequelize.models.IngresoTr.create({ ...data, status: 'pendiente' })
        return newIngreso
    }

    async find(companyId){
        const where = companyId ? { companyId } : {};
        const ingresos = await sequelize.models.IngresoTr.findAll({ where, raw: true })
        return ingresos
    }

    async findRecent(limit = 5, companyId){
        const where = companyId ? { companyId } : {};
        const ingresos = await sequelize.models.IngresoTr.findAll({ 
            where,
            order: [['id', 'DESC']],
            limit: limit,
            raw: true
        })
        return ingresos
    }

    async findOne(id, companyId){
        const where = companyId ? { id, companyId } : { id };
        const ingreso = await sequelize.models.IngresoTr.findOne({ where, raw: true })
        return ingreso
    }

    async findByCorrelativo(correlativo, companyId){
        const where = companyId ? { correlativo, companyId } : { correlativo };
        const ingreso = await sequelize.models.IngresoTr.findOne({ where, raw: true })
        return ingreso
    }

    async update(id, changes, companyId){
        const where = companyId ? { id, companyId } : { id };
        const existing = await sequelize.models.IngresoTr.findOne({ where })
        if(!existing) return null
        const { status, ...safeChanges } = changes
        await existing.update(safeChanges)
        return await this.findOne(id, companyId)
    }

    async delete(id, companyId){
        const where = companyId ? { id, companyId } : { id };
        const ingreso = await sequelize.models.IngresoTr.findOne({ where })
        if(!ingreso) return null
        if(ingreso.status === 'completado'){
            throw boom.conflict('El estado completado no permite la eliminacion, contacte a su supervisor')
        }
        await ingreso.update({ status: 'anulado', numeroFactura: null })
        return await this.findOne(id, companyId)
    }

    async findByCompany(companyId){
        const ingresos = await sequelize.models.IngresoTr.findAll({ 
            where: { companyId: companyId },
            raw: true
        })
        return ingresos
    }

    async generateCorrelativo(companyId){
        return await this.correlativoService.generateCorrelativo(companyId, 'ing')
    }

    async getStats(companyId){
        const where = companyId ? { companyId } : {};
        const total = await sequelize.models.IngresoTr.count({ where })
        const pendientes = await sequelize.models.IngresoTr.count({ where: { ...where, status: 'pendiente' } })
        const completados = await sequelize.models.IngresoTr.count({ where: { ...where, status: 'completado' } })
        const cancelados = await sequelize.models.IngresoTr.count({ where: { ...where, status: 'cancelado' } })
        
        const result = await sequelize.models.IngresoTr.findAll({
            where,
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
