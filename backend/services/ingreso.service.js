const sequelize = require('../libs/sequelize')

class IngresoTrService{
    constructor(){}

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

    async generateCorrelativo(){
        const lastIngreso = await sequelize.models.IngresoTr.findOne({
            order: [['id', 'DESC']],
            raw: true
        })
        
        let nextNumber = 1
        if(lastIngreso && lastIngreso.correlativo){
            const match = lastIngreso.correlativo.match(/ING-(\d+)/)
            if(match){
                nextNumber = parseInt(match[1]) + 1
            }
        }
        
        return `ING-${nextNumber.toString().padStart(5, '0')}`
    }
}

module.exports=IngresoTrService
