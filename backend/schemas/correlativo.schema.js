const Joi = require('joi');

const id = Joi.number().integer();
const codEmpresa = Joi.number().integer();
const companyId = Joi.number().integer();
const tipo = Joi.string().valid('ing', 'fac', 'sal', 'sol', 'ingreso', 'factura', 'salida', 'solicitud');
const numero = Joi.number().integer().min(0);
const descripcion = Joi.string().max(100).allow('', null);
const fecha = Joi.date();

const createCorrelativoSchema = Joi.object({
  codEmpresa:codEmpresa.optional(),
  companyId:companyId.optional(),
  tipo:tipo.required(),
  numero:numero.optional(),
  descripcion:descripcion.optional(),
  fecha:fecha.optional()
})

const updateCorrelativoSchema = Joi.object({
  codEmpresa:codEmpresa,
  companyId:companyId,
  tipo:tipo,
  numero:numero,
  descripcion:descripcion,
  fecha:fecha
})

const getCorrelativoSchema = Joi.object({
  id:id.required()
})

module.exports={createCorrelativoSchema, updateCorrelativoSchema, getCorrelativoSchema}
