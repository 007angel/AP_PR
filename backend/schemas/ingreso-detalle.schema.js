const Joi = require('joi');

const id = Joi.number().integer();
const ingresoId = Joi.number().integer();
const lote = Joi.string().max(50);
const articulo = Joi.string().max(200);
const tarima = Joi.number().integer();
const caja = Joi.number().integer();
const unidad = Joi.number().integer();
const totalIngreso = Joi.number().integer();
const solicitado = Joi.number().integer();
const entregado = Joi.number().integer();
const mermas = Joi.number().integer();
const devolucion = Joi.number().integer();
const costoIndividual = Joi.number();

const createIngresoDetalleSchema = Joi.object({
  ingreso_id: ingresoId.required(),
  lote: lote.required(),
  articulo: articulo.required(),
  tarima: tarima.required(),
  caja: caja.required(),
  unidad: unidad.required(),
  total_ingreso: totalIngreso.required(),
  solicitado: solicitado.required(),
  entregado: entregado.required(),
  mermas: mermas.required(),
  devolucion: devolucion.required(),
  costo_individual: costoIndividual.required()
});

const updateIngresoDetalleSchema = Joi.object({
  lote: lote,
  articulo: articulo,
  tarima: tarima,
  caja: caja,
  unidad: unidad,
  total_ingreso: totalIngreso,
  solicitado: solicitado,
  entregado: entregado,
  mermas: mermas,
  devolucion: devolucion,
  costo_individual: costoIndividual
});

const getIngresoDetalleSchema = Joi.object({
  id: id.required()
});

module.exports = { createIngresoDetalleSchema, updateIngresoDetalleSchema, getIngresoDetalleSchema };
