const Joi = require('joi');

const userId = Joi.number().integer().allow(null);
const pregunta = Joi.string().min(2).max(500);
const respuesta = Joi.string().min(2);
const categoria = Joi.string().max(100).allow('', null);
const palabrasClave = Joi.array().items(Joi.string());
const activo = Joi.boolean();
const id = Joi.number().integer();

const sendMessageSchema = Joi.object({
  pregunta: pregunta.required(),
  userId: userId.optional()
});

const createKnowledgeSchema = Joi.object({
  pregunta: pregunta.required(),
  respuesta: respuesta.required(),
  categoria: categoria.optional(),
  palabrasClave: palabrasClave.optional(),
  activo: activo.optional()
});

const updateKnowledgeSchema = Joi.object({
  pregunta: pregunta,
  respuesta: respuesta,
  categoria: categoria,
  palabrasClave: palabrasClave,
  activo: activo
});

const getKnowledgeSchema = Joi.object({
  id: id.required()
});

module.exports = { sendMessageSchema, createKnowledgeSchema, updateKnowledgeSchema, getKnowledgeSchema };
