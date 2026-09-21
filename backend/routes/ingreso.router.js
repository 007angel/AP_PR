const express = require('express');
const ingresoService = require('../services/ingreso.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createIngresoSchema, updateIngresoSchema, getIngresoSchema } = require('../schemas/ingreso.schema');

const router = express.Router();
const service = new ingresoService();

router.get('/',
async(req, res, next)=>{
  try{
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const ingresos = await service.find(companyId);
    res.json(ingresos)
  }catch(error){
    next(error)
  }
}
)

router.get('/by-company/:companyId',
async(req, res, next)=>{
  try{
    const { companyId } = req.params
    const ingresos = await service.findByCompany(parseInt(companyId))
    res.json(ingresos)
  }catch(error){
    next(error)
  }
}
)

router.get('/stats',
async(req, res, next)=>{
  try{
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const stats = await service.getStats(companyId);
    res.json(stats)
  }catch(error){
    next(error)
  }
}
)

router.get('/recent',
async(req, res, next)=>{
  try{
    const limit = parseInt(req.query.limit) || 5;
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const ingresos = await service.findRecent(limit, companyId);
    res.json(ingresos)
  }catch(error){
    next(error)
  }
}
)

router.get('/correlativo/:companyId',
async(req, res, next)=>{
  try{
    const{ companyId }= req.params;
    const correlativo = await service.generateCorrelativo(companyId);
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
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const ingreso= await service.findOne(id, companyId);
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
    const companyId = body.companyId || null;
    const userRole = body.userRole || 'user';
    if (userRole !== 'master' && userRole !== 'admin' && body.fechaIngreso) {
      const fecha = new Date(body.fechaIngreso);
      const limite = new Date();
      limite.setDate(limite.getDate() - 15);
      limite.setHours(0, 0, 0, 0);
      if (fecha < limite) {
        return res.status(400).json({message:'Solo puede registrar ingresos con fecha no mayor a 15 dias. Solicite al administrador.'});
      }
    }
    const existingCorrelativo = await service.findByCorrelativo(body.correlativo, companyId);
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
    const companyId = changes.companyId || req.query.companyId ? parseInt(changes.companyId || req.query.companyId) : null;
    const ingreso = await service.update(id, changes, companyId);
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
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const result = await service.delete(id, companyId);
    if(!result){
      res.status(404).json({message:'Ingreso no encontrado'})
    }else{
      res.json({message:'Ingreso anulado', ingreso: result})
    }
  }catch(error){
    next(error)
  }
}
)

module.exports=router;
