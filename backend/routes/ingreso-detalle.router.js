const express = require('express');
const IngresoDetalleTrService = require('../services/ingreso-detalle.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createIngresoDetalleSchema, updateIngresoDetalleSchema, getIngresoDetalleSchema } = require('../schemas/ingreso-detalle.schema');

const router = express.Router();
const service = new IngresoDetalleTrService();

router.get('/', async (req, res, next) => {
  try {
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const detalles = await service.find(companyId);
    res.json(detalles);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validatorHandler(getIngresoDetalleSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const detalle = await service.findOne(id, companyId);
    if (!detalle) {
      res.status(404).json({ message: 'Detalle no encontrado' });
    } else {
      res.json(detalle);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/ingreso/:ingresoId', async (req, res, next) => {
  try {
    const { ingresoId } = req.params;
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const detalles = await service.findByIngreso(ingresoId, companyId);
    res.json(detalles);
  } catch (error) {
    next(error);
  }
});

router.post('/', validatorHandler(createIngresoDetalleSchema, 'body'), async (req, res, next) => {
  try {
    const body = req.body;
    const newDetalle = await service.create(body);
    res.status(201).json(newDetalle);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validatorHandler(getIngresoDetalleSchema, 'params'), validatorHandler(updateIngresoDetalleSchema, 'body'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const companyId = body.companyId || req.query.companyId ? parseInt(body.companyId || req.query.companyId) : null;
    const detalle = await service.update(id, body, companyId);
    if (!detalle) {
      res.status(404).json({ message: 'Detalle no encontrado' });
    } else {
      res.json(detalle);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validatorHandler(getIngresoDetalleSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const result = await service.delete(id, companyId);
    if (!result) {
      res.status(404).json({ message: 'Detalle no encontrado' });
    } else {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/ingreso/:ingresoId', async (req, res, next) => {
  try {
    const { ingresoId } = req.params;
    const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
    const result = await service.deleteByIngreso(ingresoId, companyId);
    if (!result) {
      res.status(404).json({ message: 'Ingreso no encontrado' });
    } else {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
