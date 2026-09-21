const express = require('express');
const MovimientosService = require('../services/movimientos.service');

const router = express.Router();
const service = new MovimientosService();

router.get('/', async (req, res, next) => {
  try {
    const companyId = req.query.companyId || null;
    const result = await service.getResumen(companyId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
