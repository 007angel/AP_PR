const sequelize = require('../libs/sequelize')

class CorrelativoTrService{
    constructor(){}

    async create(data){
        const newCorrelativo = await sequelize.models.CorrelativoTr.create(data)
        return newCorrelativo
    }

    async find(){
        const correlativos = await sequelize.models.CorrelativoTr.findAll({ raw: true })
        return correlativos
    }

    async findOne(id){
        const correlativo = await sequelize.models.CorrelativoTr.findByPk(id, { raw: true })
        return correlativo
    }

    async findByCompany(companyId){
        const correlativos = await sequelize.models.CorrelativoTr.findAll({ 
            where: { companyId: companyId },
            raw: true
        })
        return correlativos
    }

    async findByCompanyAndType(companyId, tipo){
        const correlativo = await sequelize.models.CorrelativoTr.findOne({ 
            where: { companyId, tipo },
            raw: true
        })
        return correlativo
    }

    async update(id, changes){
        const existing = await sequelize.models.CorrelativoTr.findByPk(id)
        if(!existing) return null
        await existing.update(changes)
        return await this.findOne(id)
    }

    async delete(id){
        const correlativo = await sequelize.models.CorrelativoTr.findByPk(id)
        if(!correlativo) return null
        await correlativo.destroy()
        return { id }
    }

    async generateCorrelativo(companyId, tipo, prefijo){
        let correlativo = await this.findByCompanyAndType(companyId, tipo)
        
        if(!correlativo){
            correlativo = await this.create({
                companyId,
                tipo,
                prefijo,
                ultimoNumero: 0,
                descripcion: `Correlativo de ${tipo}`
            })
        }

        const nuevoNumero = correlativo.ultimoNumero + 1
        await this.update(correlativo.id, { ultimoNumero: nuevoNumero })

        return `${prefijo}-${nuevoNumero.toString().padStart(5, '0')}`
    }

    async initDefaultCorrelativos(companyId){
        const defaults = [
            { tipo: 'ingreso', prefijo: 'ING', descripcion: 'Correlativo de Ingresos' },
            { tipo: 'factura', prefijo: 'FAC', descripcion: 'Correlativo de Facturas' },
            { tipo: 'salida', prefijo: 'SAL', descripcion: 'Correlativo de Salidas' },
            { tipo: 'solicitud', prefijo: 'SOL', descripcion: 'Correlativo de Solicitudes' }
        ]

        for(const item of defaults){
            const existing = await this.findByCompanyAndType(companyId, item.tipo)
            if(!existing){
                await this.create({
                    companyId,
                    tipo: item.tipo,
                    prefijo: item.prefijo,
                    ultimoNumero: 0,
                    descripcion: item.descripcion
                })
            }
        }

        return await this.findByCompany(companyId)
    }
}

module.exports=CorrelativoTrService
