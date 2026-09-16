const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(2).max(100);
const email = Joi.string().email();
const password = Joi.string().min(8).max(15);
const status = Joi.string().valid('active', 'inactive', 'suspended', 'trial');
const role = Joi.string().valid('master', 'admin', 'user');
const modules = Joi.array().items(Joi.string());
const companyId = Joi.number().integer().allow(null);
const codigo = Joi.string().max(20).allow('', null);
const createdByCompanyId = Joi.number().integer().allow(null);
const idUsuarioMaster = Joi.number().integer().allow(null);
const idEmpresaMaster = Joi.number().integer().allow(null);

const createUserSchema = Joi.object({
  name:name.required(),
  email:email.required(),
  password:password.required(),
  status:status.optional(),
  role:role.optional(),
  modules:modules.optional(),
  companyId:companyId.optional(),
  codigo:codigo.optional(),
  createdByCompanyId:createdByCompanyId.optional(),
  idUsuarioMaster:idUsuarioMaster.optional(),
  idEmpresaMaster:idEmpresaMaster.optional()
})

const updateUserSchema = Joi.object({
  name:name,
  email:email,
  status:status,
  role:role,
  modules:modules,
  companyId:companyId,
  codigo:codigo,
  createdByCompanyId:createdByCompanyId,
  idUsuarioMaster:idUsuarioMaster,
  idEmpresaMaster:idEmpresaMaster
})

const getUserSchema = Joi.object({
  id:id.required()
})

const resetPasswordSchema = Joi.object({
  email:email.required()
})

module.exports={updateUserSchema, createUserSchema, getUserSchema, resetPasswordSchema}
