//DTO - SCHEMAS
const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8).max(15);

const createUserSchema = Joi.object({
  email:email.required(),
  password:password.required()
})

const updateUserSchema = Joi.object({
  email:email.required()
})

const getUserSchema = Joi.object({
  id:id.required()
})

module.exports={updateUserSchema, createUserSchema, getUserSchema}
