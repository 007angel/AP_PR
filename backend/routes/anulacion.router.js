const express = require('express');
const AnulacionService = require('../services/anulacion.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createAnulacionSchema, updateAnulacionSchema, getAnulacionSchema } = require('../schemas/anulacion.schema');

const router = express.Router();
const service = new AnulacionService();

router.get('/',
async(req, res, next)=>{
  try{
    const rows = await service.find();
    res.json(rows)
  }catch(error){
    next(error)
  }
}
)

router.get('/:id',validatorHandler(getAnulacionSchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const row = await service.findOne(id);
    res.json(row)
  }catch(error){
    next(error)
  }
}
)

router.post('/',
validatorHandler(createAnulacionSchema,'body'),
async(req, res, next)=>{
  try{
    const row = await service.create(req.body);
    res.status(201).json(row)
  }catch(error){
    next(error)
  }
}
)

router.post('/:id/aprobar',
validatorHandler(getAnulacionSchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const row = await service.approve(id);
    res.json(row)
  }catch(error){
    next(error)
  }
}
)

router.post('/:id/rechazar',
validatorHandler(getAnulacionSchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const row = await service.reject(id);
    res.json(row)
  }catch(error){
    next(error)
  }
}
)

router.put('/:id',
  validatorHandler(getAnulacionSchema,'params'),
  validatorHandler(updateAnulacionSchema,'body'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const row = await service.update(id, req.body);
    res.json(row)
  }catch(error){
    next(error)
  }
}
)

router.delete('/:id',
  validatorHandler(getAnulacionSchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const result = await service.delete(id);
    res.json({message:'Solicitud eliminada', id: result.id})
  }catch(error){
    next(error)
  }
}
)

module.exports=router;
