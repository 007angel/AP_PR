const Joi = require('joi');

const id = Joi.number().integer();
const companyId = Joi.number().integer();
const tipo = Joi.string().valid('ingreso', 'factura', 'salida', 'solicitud');
const prefijo = Joi.string().min(2).max(10);
const ultimoNumero = Joi.number().integer().min(0);
const descripcion = Joi.string().max(100).allow('', null);

const createCorrelativoSchema = Joi.object({
  companyId:companyId.required(),
  tipo:tipo.required(),
  prefijo:prefijo.required(),
  ultimoNumero:ultimoNumero.optional(),
  descripcion:descripcion.optional()
})

const updateCorrelativoSchema = Joi.object({
  companyId:companyId,
  tipo:tipo,
  prefijo:prefijo,
  ultimoNumero:ultimoNumero,
  descripcion:descripcion
})

const getCorrelativoSchema = Joi.object({
  id:id.required()
})

module.exports={createCorrelativoSchema, updateCorrelativoSchema, getCorrelativoSchema}
