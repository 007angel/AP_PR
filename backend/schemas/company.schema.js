const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(2).max(100);
const rif = Joi.string().min(5).max(20);
const email = Joi.string().email();
const phone = Joi.string().max(20).allow('', null);
const address = Joi.string().max(200).allow('', null);
const city = Joi.string().max(50).allow('', null);
const state = Joi.string().max(50).allow('', null);
const country = Joi.string().max(50).allow('', null);
const logo = Joi.string().uri().allow('', null);
const website = Joi.string().uri().allow('', null);
const status = Joi.string().valid('active', 'inactive', 'suspended');
const plan = Joi.string().valid('basic', 'professional', 'enterprise');
const maxUsers = Joi.number().integer().min(1).max(1000);
const password = Joi.string().min(8).max(15);

const createCompanySchema = Joi.object({
  name:name.required(),
  rif:rif.required(),
  email:email.required(),
  phone:phone.optional(),
  address:address.optional(),
  city:city.optional(),
  state:state.optional(),
  country:country.optional(),
  logo:logo.optional(),
  website:website.optional(),
  status:status.optional(),
  plan:plan.optional(),
  maxUsers:maxUsers.optional()
})

const registerCompanySchema = Joi.object({
  company: Joi.object({
    name:name.required(),
    rif:rif.required(),
    email:email.required(),
    phone:phone.optional(),
    address:address.optional(),
    city:city.optional(),
    state:state.optional(),
    country:country.optional()
  }).required(),
  admin: Joi.object({
    name:name.required(),
    email:email.required(),
    password:password.required()
  }).required()
})

const updateCompanySchema = Joi.object({
  name:name,
  rif:rif,
  email:email,
  phone:phone,
  address:address,
  city:city,
  state:state,
  country:country,
  logo:logo,
  website:website,
  status:status,
  plan:plan,
  maxUsers:maxUsers
})

const getCompanySchema = Joi.object({
  id:id.required()
})

module.exports={createCompanySchema, registerCompanySchema, updateCompanySchema, getCompanySchema}
