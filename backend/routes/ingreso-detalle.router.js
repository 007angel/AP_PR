const express = require('express');
const IngresoDetalleTrService = require('../services/ingreso-detalle.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createIngresoDetalleSchema, updateIngresoDetalleSchema, getIngresoDetalleSchema } = require('../schemas/ingreso-detalle.schema');

const router = express.Router();
const service = new IngresoDetalleTrService();

router.get('/', async (req, res, next) => {
  try {
    const detalles = await service.find();
    res.json(detalles);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validatorHandler(getIngresoDetalleSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const detalle = await service.findOne(id);
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
    const detalles = await service.findByIngreso(ingresoId);
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
    const detalle = await service.update(id, body);
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
    const result = await service.delete(id);
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
    const result = await service.deleteByIngreso(ingresoId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
