const Joi = require('joi');

const id = Joi.number().integer();
const correlativo = Joi.string().min(5).max(20);
const numeroFactura = Joi.string().min(3).max(50);
const fechaIngreso = Joi.date();
const fechaDigitacion = Joi.date();
const cantidadTarimas = Joi.number().integer().min(0);
const usuarioDigito = Joi.string().min(2).max(100);
const proveedor = Joi.string().max(100).allow('', null);
const observaciones = Joi.string().max(500).allow('', null);
const status = Joi.string().valid('pendiente', 'completado', 'cancelado');
const companyId = Joi.number().integer();
const userId = Joi.number().integer();

const createIngresoSchema = Joi.object({
  correlativo:correlativo.required(),
  numeroFactura:numeroFactura.required(),
  fechaIngreso:fechaIngreso.required(),
  fechaDigitacion:fechaDigitacion.required(),
  cantidadTarimas:cantidadTarimas.required(),
  usuarioDigito:usuarioDigito.required(),
  proveedor:proveedor.optional(),
  observaciones:observaciones.optional(),
  status:status.optional(),
  companyId:companyId.optional(),
  userId:userId.optional()
})

const updateIngresoSchema = Joi.object({
  correlativo:correlativo,
  numeroFactura:numeroFactura,
  fechaIngreso:fechaIngreso,
  fechaDigitacion:fechaDigitacion,
  cantidadTarimas:cantidadTarimas,
  usuarioDigito:usuarioDigito,
  proveedor:proveedor,
  observaciones:observaciones,
  status:status,
  companyId:companyId,
  userId:userId
})

const getIngresoSchema = Joi.object({
  id:id.required()
})

module.exports={createIngresoSchema, updateIngresoSchema, getIngresoSchema}
