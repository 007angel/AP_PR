const Joi = require('joi');

const id = Joi.number().integer();
const nombre = Joi.string().min(2).max(200);
const email = Joi.string().email().allow('', null);
const telefono = Joi.string().max(50).allow('', null);
const direccion = Joi.string().max(500).allow('', null);
const rif = Joi.string().max(30).allow('', null);
const contacto = Joi.string().max(200).allow('', null);
const observaciones = Joi.string().max(500).allow('', null);
const companyId = Joi.number().integer().allow(null);
const userId = Joi.number().integer().allow(null);

const createClienteSchema = Joi.object({
  nombre: nombre.required(),
  email: email.optional(),
  telefono: telefono.optional(),
  direccion: direccion.optional(),
  rif: rif.optional(),
  contacto: contacto.optional(),
  observaciones: observaciones.optional(),
  companyId: companyId.optional(),
  userId: userId.optional()
});

const updateClienteSchema = Joi.object({
  nombre: nombre,
  email: email,
  telefono: telefono,
  direccion: direccion,
  rif: rif,
  contacto: contacto,
  observaciones: observaciones
}).options({ stripUnknown: true });

const getClienteSchema = Joi.object({
  id: id.required()
});

module.exports = { createClienteSchema, updateClienteSchema, getClienteSchema };
