const Joi = require('joi');

const id = Joi.number().integer();
const correlativo = Joi.string().max(20);
const fecha = Joi.date();
const solicitante = Joi.string().min(2).max(200);
const userId = Joi.number().integer().allow(null);
const companyId = Joi.number().integer().allow(null);
const estado = Joi.string().valid('pendiente', 'aprobado', 'rechazado', 'completado');
const observaciones = Joi.string().max(500).allow('', null);

const articulo = Joi.string().min(1).max(200);
const cantidadSolicitada = Joi.number().integer().min(1);
const cantidadEntregada = Joi.number().integer().min(0);
const ingresoId = Joi.number().integer().allow(null);
const ingresoDetalleId = Joi.number().integer().allow(null);
const lote = Joi.string().max(50).allow('', null);

const createSolicitudSchema = Joi.object({
  solicitante: solicitante.required(),
  userId: userId.optional(),
  companyId: companyId.optional(),
  clienteId: Joi.number().integer().allow(null).optional(),
  observaciones: observaciones.optional(),
  detalles: Joi.array().items(Joi.object({
    articulo: articulo.required(),
    cantidadSolicitada: cantidadSolicitada.required(),
    articuloId: Joi.number().integer().allow(null).optional(),
    lote: lote.optional()
  })).min(1).required()
});

const updateSolicitudSchema = Joi.object({
  estado: estado,
  observaciones: observaciones,
  cantidadEntregada: cantidadEntregada,
  clienteId: Joi.number().integer().allow(null).optional()
}).options({ stripUnknown: true });

const getSolicitudSchema = Joi.object({
  id: id.required()
});

module.exports = { createSolicitudSchema, updateSolicitudSchema, getSolicitudSchema };
