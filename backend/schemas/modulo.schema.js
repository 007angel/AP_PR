const Joi = require('joi');

const id = Joi.number().integer();
const nombre = Joi.string().min(2).max(100);
const ruta = Joi.string().pattern(/^\//).max(200);
const icono = Joi.string().max(10).allow('', null);
const orden = Joi.number().integer().min(0);
const seccion = Joi.string().max(50).allow('', null);
const activo = Joi.boolean();
const descripcion = Joi.string().max(500).allow('', null);

const createModuloSchema = Joi.object({
  nombre: nombre.required(),
  ruta: ruta.required(),
  icono: icono,
  orden: orden,
  seccion: seccion,
  activo: activo,
  descripcion: descripcion
});

const updateModuloSchema = Joi.object({
  nombre: nombre,
  ruta: ruta,
  icono: icono,
  orden: orden,
  seccion: seccion,
  activo: activo,
  descripcion: descripcion
});

const getModuloSchema = Joi.object({
  id: id.required()
});

module.exports = { createModuloSchema, updateModuloSchema, getModuloSchema }
