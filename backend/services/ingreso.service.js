const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize')
const CorrelativoTrService = require('./correlativo.service')

class IngresoTrService{
    constructor(){
        this.correlativoService = new CorrelativoTrService()
    }

    async create(data){
        // El estado es automatico: todo ingreso nace pendiente
        const newIngreso = await sequelize.models.IngresoTr.create({ ...data, status: 'pendiente' })
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
        // El estado es automatico (lo gestiona el detalle), se ignora cualquier cambio manual
        const { status, ...safeChanges } = changes
        await existing.update(safeChanges)
        return await this.findOne(id)
    }

    async delete(id){
        const ingreso = await sequelize.models.IngresoTr.findByPk(id)
        if(!ingreso) return null
        if(ingreso.status === 'completado'){
            throw boom.conflict('El estado completado no permite la eliminacion, contacte a su supervisor')
        }
        // Anulacion suave: cambia estado y libera la factura para poder reingresar
        await ingreso.update({ status: 'anulado', numeroFactura: null })
        return await this.findOne(id)
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
