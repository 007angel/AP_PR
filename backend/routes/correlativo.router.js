const express = require('express');
const correlativoService = require('../services/correlativo.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createCorrelativoSchema, updateCorrelativoSchema, getCorrelativoSchema } = require('../schemas/correlativo.schema');

const router = express.Router();
const service = new correlativoService();

router.get('/',
async(req, res, next)=>{
  try{
    const correlativos = await service.find();
    res.json(correlativos)
  }catch(error){
    next(error)
  }
}
)

router.get('/company/:companyId',
async(req, res, next)=>{
  try{
    const{ companyId }= req.params;
    const correlativos= await service.findByCompany(companyId);
    res.json(correlativos)
  }catch(error){
    next(error)
  }
}
)

router.get('/generate/:companyId/:tipo',
async(req, res, next)=>{
  try{
    const{ companyId, tipo }= req.params;
    const prefijos = { ingreso: 'ING', factura: 'FAC', salida: 'SAL', solicitud: 'SOL' };
    const prefijo = prefijos[tipo];
    
    if(!prefijo){
      return res.status(400).json({message:'Tipo de correlativo no valido'})
    }
    
    const correlativo= await service.generateCorrelativo(companyId, tipo, prefijo);
    res.json({ correlativo })
  }catch(error){
    next(error)
  }
}
)

router.post('/init/:companyId',
async(req, res, next)=>{
  try{
    const{ companyId }= req.params;
    const correlativos= await service.initDefaultCorrelativos(companyId);
    res.json(correlativos)
  }catch(error){
    next(error)
  }
}
)

router.get('/:id',validatorHandler(getCorrelativoSchema,'params'),
async(req, res, next)=>{
  try{
    const{ id }= req.params;
    const correlativo= await service.findOne(id);
    if(!correlativo){
      res.status(404).json({message:'Correlativo no encontrado'})
    }else{
      res.json(correlativo)
    }
  }catch(error){
    next(error)
  }
}
)

router.post('/',
validatorHandler(createCorrelativoSchema,'body'),
async(req, res, next)=>{
  try{
    const body = req.body;
    const correlativo = await service.create(body);
    res.status(201).json(correlativo)
  }catch(error){
    next(error)
  }
}
)

router.put('/:id',
  validatorHandler(getCorrelativoSchema,'params'),
  validatorHandler(updateCorrelativoSchema,'body'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const changes = req.body;
    const correlativo = await service.update(id, changes);
    if(!correlativo){
      res.status(404).json({message:'Correlativo no encontrado'})
    }else{
      res.json(correlativo)
    }
  }catch(error){
    next(error)
  }
}
)

router.delete('/:id',
  validatorHandler(getCorrelativoSchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const result = await service.delete(id);
    if(!result){
      res.status(404).json({message:'Correlativo no encontrado'})
    }else{
      res.json({message:'Correlativo eliminado', id})
    }
  }catch(error){
    next(error)
  }
}
)

module.exports=router;
