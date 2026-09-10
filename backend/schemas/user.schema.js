const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(2).max(100);
const email = Joi.string().email();
const password = Joi.string().min(8).max(15);
const status = Joi.string().valid('active', 'inactive', 'suspended', 'trial');
const role = Joi.string().valid('master', 'admin', 'user');
const modules = Joi.array().items(Joi.string());

const createUserSchema = Joi.object({
  name:name.required(),
  email:email.required(),
  password:password.required(),
  status:status.optional(),
  role:role.optional(),
  modules:modules.optional()
})

const updateUserSchema = Joi.object({
  name:name,
  email:email,
  status:status,
  role:role,
  modules:modules
})

const getUserSchema = Joi.object({
  id:id.required()
})

const resetPasswordSchema = Joi.object({
  email:email.required()
})

module.exports={updateUserSchema, createUserSchema, getUserSchema, resetPasswordSchema}
