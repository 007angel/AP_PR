const express = require('express');
const userService = require('../services/user.service');
const validatorHandleer = require('../middlewares/validator.handler');
const { getUserSchema, createUserSchema, updateUserSchema, resetPasswordSchema } = require('../schemas/user.schema');

const router = express.Router();
const service = new userService();

router.get('/',
async(req, res, next)=>{
  try{
    const { companyId } = req.query
    let users
    if(companyId){
      users = await service.findByCompany(parseInt(companyId))
    }else{
      users = await service.find();
    }
    res.json(users)
  }catch(error){
    next(error)
  }
}
)

router.get('/by-company/:companyId',
async(req, res, next)=>{
  try{
    const { companyId } = req.params
    const users = await service.findByCompany(parseInt(companyId))
    res.json(users)
  }catch(error){
    next(error)
  }
}
)

router.get('/count-by-company/:companyId',
async(req, res, next)=>{
  try{
    const { companyId } = req.params
    const count = await service.countByCompany(parseInt(companyId))
    res.json({ count })
  }catch(error){
    next(error)
  }
}
)

router.get('/:id',validatorHandleer(getUserSchema,'params'),
async(req, res, next)=>{
  try{
    const{ id }= req.params;
    const user= await service.findOne(id);
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

router.post('/',
validatorHandleer(createUserSchema,'body'),
async(req, res, next)=>{
  try{
    const body = req.body;
    const user = await service.create(body);
    res.status(201).json(user)
  }catch(error){
    next(error)
  }
}
)

router.post('/login',
async(req, res, next)=>{
  try{
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({message:'Email y contraseña son requeridos'})
    }
    const user = await service.findByEmail(email);
    if(!user){
      return res.status(401).json({message:'El correo electrónico no está registrado'})
    }
    const isValid = await service.comparePasswords(password, user.password);
    if(!isValid){
      return res.status(401).json({message:'La contraseña es incorrecta'})
    }
    const { password: _, ...safeUser } = user;
    res.json(safeUser)
  }catch(error){
    next(error)
  }
}
)

router.post('/reset-password',
validatorHandleer(resetPasswordSchema,'body'),
async(req, res, next)=>{
  try{
    const { email } = req.body;
    const result = await service.resetPassword(email);
    if(!result){
      return res.status(404).json({message:'Correo electrónico no encontrado'})
    }
    res.json({message:'Contraseña temporal generada', tempPassword: result.tempPassword})
  }catch(error){
    next(error)
  }
}
)

router.put('/:id',
  validatorHandleer(getUserSchema,'params'),
  validatorHandleer(updateUserSchema,'body'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const changes = req.body;
    const user = await service.update(id, changes);
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

router.put('/:id/modules',
  validatorHandleer(getUserSchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const { modules } = req.body;
    const user = await service.updateModules(id, modules);
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

router.delete('/:id',
  validatorHandleer(getUserSchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const result = await service.delete(id);
    if(!result){
      res.status(404).json({message:'Usuario no encontrado'})
    }else{
      res.json({message:'Usuario eliminado', id})
    }
  }catch(error){
    next(error)
  }
}
)

module.exports=router;
