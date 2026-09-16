const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize')

// Codigo corto -> prefijo. Se aceptan los nombres largos antiguos por compatibilidad.
const TIPOS = {
  ing: 'ING',
  fac: 'FAC',
  sal: 'SAL',
  sol: 'SOL',
  ingreso: 'ING',
  factura: 'FAC',
  salida: 'SAL',
  solicitud: 'SOL'
};

const DESCRIPCIONES = {
  ing: 'Ingresos',
  fac: 'Facturas',
  sal: 'Salidas',
  sol: 'Solicitudes'
};

function normalizeTipo(tipo){
  if(!tipo) return null;
  const short = { ingreso: 'ing', factura: 'fac', salida: 'sal', solicitud: 'sol' }[String(tipo).toLowerCase()] || String(tipo).toLowerCase();
  return TIPOS[short] ? short : null;
}

function formatCorrelativo(tipo, codEmpresa, numero){
  const prefijo = TIPOS[tipo];
  const emp = String(codEmpresa).padStart(3, '0');
  const num = String(numero).padStart(4, '0');
  return `${prefijo}${emp}${num}`;
}

class CorrelativoTrService{
    constructor(){}

    async create(data){
        const codEmpresa = data.codEmpresa ?? data.companyId;
        if(!codEmpresa){
            throw boom.badRequest('cod_empresa es requerido');
        }
        const tipo = normalizeTipo(data.tipo);
        if(!tipo){
            throw boom.badRequest('Tipo de correlativo no valido (ing, fac, sal, sol)');
        }
        const newCorrelativo = await sequelize.models.CorrelativoTr.create({
            tipo,
            codEmpresa,
            numero: data.numero ?? 0,
            descripcion: data.descripcion ?? `${DESCRIPCIONES[tipo]} de la empresa ${codEmpresa}`,
            fecha: data.fecha ?? new Date()
        })
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
            where: { codEmpresa: companyId },
            raw: true
        })
        return correlativos
    }

    async findByCompanyAndType(companyId, tipo){
        const short = normalizeTipo(tipo);
        if(!short) return null;
        const correlativo = await sequelize.models.CorrelativoTr.findOne({
            where: { codEmpresa: companyId, tipo: short },
            raw: true
        })
        return correlativo
    }

    async update(id, changes){
        const existing = await sequelize.models.CorrelativoTr.findByPk(id)
        if(!existing) return null
        const safe = { ...changes };
        delete safe.companyId;
        if(safe.codEmpresa === undefined && changes.companyId !== undefined){
            safe.codEmpresa = changes.companyId;
        }
        if(safe.tipo !== undefined){
            const short = normalizeTipo(safe.tipo);
            if(!short){
                throw boom.badRequest('Tipo de correlativo no valido (ing, fac, sal, sol)');
            }
            safe.tipo = short;
        }
        await existing.update(safe)
        return await this.findOne(id)
    }

    async delete(id){
        const correlativo = await sequelize.models.CorrelativoTr.findByPk(id)
        if(!correlativo) return null
        await correlativo.destroy()
        return { id }
    }

    async generateCorrelativo(companyId, tipo){
        const short = normalizeTipo(tipo);
        if(!short){
            throw boom.badRequest('Tipo de correlativo no valido (ing, fac, sal, sol)');
        }

        let correlativo = await this.findByCompanyAndType(companyId, short);

        if(!correlativo){
            const created = await this.create({
                codEmpresa: companyId,
                tipo: short,
                numero: 0
            })
            correlativo = created.toJSON ? created.toJSON() : created;
        }

        const nuevoNumero = (correlativo.numero || 0) + 1
        await this.update(correlativo.id, { numero: nuevoNumero, fecha: new Date() })

        return formatCorrelativo(short, companyId, nuevoNumero)
    }

    async initDefaultCorrelativos(companyId){
        const defaults = ['ing', 'fac', 'sal', 'sol']

        for(const tipo of defaults){
            const existing = await this.findByCompanyAndType(companyId, tipo)
            if(!existing){
                await this.create({
                    codEmpresa: companyId,
                    tipo
                })
            }
        }

        return await this.findByCompany(companyId)
    }
}

module.exports=CorrelativoTrService
module.exports.normalizeTipo = normalizeTipo;
module.exports.formatCorrelativo = formatCorrelativo;
