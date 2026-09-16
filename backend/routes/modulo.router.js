const express = require('express');
const ModuloService = require('../services/modulo.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createModuloSchema, updateModuloSchema, getModuloSchema } = require('../schemas/modulo.schema');

const router = express.Router();
const service = new ModuloService();

router.get('/',
async(req, res, next)=>{
  try{
    const modulos = await service.find();
    res.json(modulos)
  }catch(error){
    next(error)
  }
}
)

router.get('/activos',
async(req, res, next)=>{
  try{
    const modulos = await service.findActivos();
    res.json(modulos)
  }catch(error){
    next(error)
  }
}
)

router.get('/:id',validatorHandler(getModuloSchema,'params'),
async(req, res, next)=>{
  try{
    const{ id }= req.params;
    const modulo = await service.findOne(id);
    res.json(modulo)
  }catch(error){
    next(error)
  }
}
)

router.post('/',
validatorHandler(createModuloSchema,'body'),
async(req, res, next)=>{
  try{
    const body = req.body;
    const modulo = await service.create(body);
    res.status(201).json(modulo)
  }catch(error){
    next(error)
  }
}
)

router.put('/:id',
  validatorHandler(getModuloSchema,'params'),
  validatorHandler(updateModuloSchema,'body'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const changes = req.body;
    const modulo = await service.update(id, changes);
    res.json(modulo)
  }catch(error){
    next(error)
  }
}
)

router.delete('/:id',
  validatorHandler(getModuloSchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const result = await service.delete(id);
    res.json({message:'Modulo eliminado', id: result.id})
  }catch(error){
    next(error)
  }
}
)

module.exports=router;
