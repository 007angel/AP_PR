const Joi = require('joi');

const id = Joi.number().integer();
const codigo = Joi.string().max(50).allow('', null);
const nombre = Joi.string().min(2).max(200);
const descripcion = Joi.string().max(2000).allow('', null);
const unidad = Joi.string().max(30).allow('', null);
const precio = Joi.number().min(0).allow(null);
const foto = Joi.string().allow('', null);
const companyId = Joi.number().integer().allow(null);
const userId = Joi.number().integer().allow(null);

const createArticuloSchema = Joi.object({
  codigo: codigo.optional(),
  nombre: nombre.required(),
  descripcion: descripcion.optional(),
  unidad: unidad.optional(),
  precio: precio.optional(),
  foto: foto.optional(),
  companyId: companyId.optional(),
  userId: userId.optional()
});

const updateArticuloSchema = Joi.object({
  codigo: codigo,
  nombre: nombre,
  descripcion: descripcion,
  unidad: unidad,
  precio: precio,
  foto: foto
});

const getArticuloSchema = Joi.object({
  id: id.required()
});

module.exports = { createArticuloSchema, updateArticuloSchema, getArticuloSchema };
