const Joi = require('joi');

const id = Joi.number().integer();
const ingresoId = Joi.number().integer();
const motivo = Joi.string().max(500).allow('', null);
const solicitadoPor = Joi.number().integer().allow(null);
const estado = Joi.string().valid('pendiente', 'aprobada', 'rechazada');
const companyId = Joi.number().integer().allow(null);

const createAnulacionSchema = Joi.object({
  ingreso_id: ingresoId,
  ingresoId: ingresoId,
  motivo: motivo,
  solicitado_por: solicitadoPor,
  solicitadoPor: solicitadoPor,
  companyId: companyId.optional()
}).or('ingreso_id', 'ingresoId');

const updateAnulacionSchema = Joi.object({
  motivo: motivo,
  estado: estado,
  companyId: companyId
}).options({ stripUnknown: true });

const getAnulacionSchema = Joi.object({
  id: id.required()
});

module.exports = { createAnulacionSchema, updateAnulacionSchema, getAnulacionSchema }
