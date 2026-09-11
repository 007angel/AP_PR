const express = require('express');
const companyService = require('../services/company.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createCompanySchema, registerCompanySchema, updateCompanySchema, getCompanySchema } = require('../schemas/company.schema');

const router = express.Router();
const service = new companyService();

router.get('/',
async(req, res, next)=>{
  try{
    const companies = await service.find();
    res.json(companies)
  }catch(error){
    next(error)
  }
}
)

router.get('/:id',validatorHandler(getCompanySchema,'params'),
async(req, res, next)=>{
  try{
    const{ id }= req.params;
    const company= await service.findOne(id);
    if(!company){
      res.status(404).json({message:'Empresa no encontrada'})
    }else{
      res.json(company)
    }
  }catch(error){
    next(error)
  }
}
)

router.get('/:id/users',validatorHandler(getCompanySchema,'params'),
async(req, res, next)=>{
  try{
    const{ id }= req.params;
    const users= await service.getUsers(id);
    res.json(users)
  }catch(error){
    next(error)
  }
}
)

router.post('/register',
validatorHandler(registerCompanySchema,'body'),
async(req, res, next)=>{
  try{
    const { company: companyData, admin: adminData } = req.body;
    const result = await service.register(companyData, adminData);
    if(result.error){
      return res.status(400).json({message: result.error})
    }
    res.status(201).json(result)
  }catch(error){
    next(error)
  }
}
)

router.post('/',
validatorHandler(createCompanySchema,'body'),
async(req, res, next)=>{
  try{
    const body = req.body;
    const existingRif = await service.findByRif(body.rif);
    if(existingRif){
      return res.status(400).json({message:'El RIF ya está registrado'})
    }
    const existingEmail = await service.findByEmail(body.email);
    if(existingEmail){
      return res.status(400).json({message:'El email ya está registrado'})
    }
    const company = await service.create(body);
    res.status(201).json(company)
  }catch(error){
    next(error)
  }
}
)

router.put('/:id',
  validatorHandler(getCompanySchema,'params'),
  validatorHandler(updateCompanySchema,'body'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const changes = req.body;
    const company = await service.update(id, changes);
    if(!company){
      res.status(404).json({message:'Empresa no encontrada'})
    }else{
      res.json(company)
    }
  }catch(error){
    next(error)
  }
}
)

router.put('/:companyId/users/:userId',
async(req, res, next)=>{
  try{
    const { companyId, userId } = req.params;
    const user = await service.linkUser(companyId, userId);
    if(!user){
      res.status(404).json({message:'Usuario no encontrado'})
    }else{
      res.json(user)
    }
  }catch(error){
    next(error)
  }
}
)

router.delete('/:companyId/users/:userId',
async(req, res, next)=>{
  try{
    const { userId } = req.params;
    const user = await service.unlinkUser(userId);
    if(!user){
      res.status(404).json({message:'Usuario no encontrado'})
    }else{
      res.json({message:'Usuario desvinculado', user})
    }
  }catch(error){
    next(error)
  }
}
)

router.delete('/:id',
  validatorHandler(getCompanySchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const result = await service.delete(id);
    if(!result){
      res.status(404).json({message:'Empresa no encontrada'})
    }else{
      res.json({message:'Empresa eliminada', id})
    }
  }catch(error){
    next(error)
  }
}
)

module.exports=router;
