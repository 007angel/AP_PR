const Joi = require('joi');

const id = Joi.number().integer();
const ingresoId = Joi.number().integer();
const motivo = Joi.string().max(500).allow('', null);
const solicitadoPor = Joi.number().integer().allow(null);
const estado = Joi.string().valid('pendiente', 'aprobada', 'rechazada');

const createAnulacionSchema = Joi.object({
  ingreso_id: ingresoId,
  ingresoId: ingresoId,
  motivo: motivo,
  solicitado_por: solicitadoPor,
  solicitadoPor: solicitadoPor
}).or('ingreso_id', 'ingresoId');

const updateAnulacionSchema = Joi.object({
  motivo: motivo,
  estado: estado
});

const getAnulacionSchema = Joi.object({
  id: id.required()
});

module.exports = { createAnulacionSchema, updateAnulacionSchema, getAnulacionSchema }
