const express = require('express');
const ingresoService = require('../services/ingreso.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createIngresoSchema, updateIngresoSchema, getIngresoSchema } = require('../schemas/ingreso.schema');

const router = express.Router();
const service = new ingresoService();

router.get('/',
async(req, res, next)=>{
  try{
    const ingresos = await service.find();
    res.json(ingresos)
  }catch(error){
    next(error)
  }
}
)

router.get('/correlativo',
async(req, res, next)=>{
  try{
    const correlativo = await service.generateCorrelativo();
    res.json({ correlativo })
  }catch(error){
    next(error)
  }
}
)

router.get('/:id',validatorHandler(getIngresoSchema,'params'),
async(req, res, next)=>{
  try{
    const{ id }= req.params;
    const ingreso= await service.findOne(id);
    if(!ingreso){
      res.status(404).json({message:'Ingreso no encontrado'})
    }else{
      res.json(ingreso)
    }
  }catch(error){
    next(error)
  }
}
)

router.post('/',
validatorHandler(createIngresoSchema,'body'),
async(req, res, next)=>{
  try{
    const body = req.body;
    const existingCorrelativo = await service.findByCorrelativo(body.correlativo);
    if(existingCorrelativo){
      return res.status(400).json({message:'El correlativo ya esta registrado'})
    }
    const ingreso = await service.create(body);
    res.status(201).json(ingreso)
  }catch(error){
    next(error)
  }
}
)

router.put('/:id',
  validatorHandler(getIngresoSchema,'params'),
  validatorHandler(updateIngresoSchema,'body'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const changes = req.body;
    const ingreso = await service.update(id, changes);
    if(!ingreso){
      res.status(404).json({message:'Ingreso no encontrado'})
    }else{
      res.json(ingreso)
    }
  }catch(error){
    next(error)
  }
}
)

router.delete('/:id',
  validatorHandler(getIngresoSchema,'params'),
async(req, res, next)=>{
  try{
    const { id } = req.params;
    const result = await service.delete(id);
    if(!result){
      res.status(404).json({message:'Ingreso no encontrado'})
    }else{
      res.json({message:'Ingreso eliminado', id})
    }
  }catch(error){
    next(error)
  }
}
)

module.exports=router;
