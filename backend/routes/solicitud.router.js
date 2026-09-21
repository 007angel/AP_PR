const express = require('express');
const SolicitudService = require('../services/solicitud.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createSolicitudSchema, updateSolicitudSchema, getSolicitudSchema } = require('../schemas/solicitud.schema');

const router = express.Router();
const service = new SolicitudService();

router.get('/',
  async (req, res, next) => {
    try {
      const { companyId, estado, userId } = req.query;
      const filters = {};
      if (companyId) filters.companyId = parseInt(companyId);
      if (estado) filters.estado = estado;
      if (userId) filters.userId = parseInt(userId);
      const solicitudes = await service.find(filters);
      res.json(solicitudes);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/available-articles',
  async (req, res, next) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
      const articles = await service.findAvailableArticles(companyId);
      res.json(articles);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/stats',
  async (req, res, next) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
      const stats = await service.getStats(companyId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/by-ingreso/:ingresoId',
  async (req, res, next) => {
    try {
      const { ingresoId } = req.params;
      const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
      const solicitudes = await service.findByIngreso(parseInt(ingresoId));
      res.json(solicitudes);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getSolicitudSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
      const solicitud = await service.findOne(id, companyId);
      if (!solicitud) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
      }
      res.json(solicitud);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createSolicitudSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const result = await service.create(body, body.companyId, body.userId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.put('/:id',
  validatorHandler(getSolicitudSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const companyId = changes.companyId || req.query.companyId ? parseInt(changes.companyId || req.query.companyId) : null;
      const solicitud = await service.update(id, changes, companyId);
      if (!solicitud) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
      }
      res.json(solicitud);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id/estado',
  validatorHandler(getSolicitudSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { estado, companyId } = req.body;
      if (!estado) {
        return res.status(400).json({ message: 'El campo estado es requerido' });
      }
      const cid = companyId ? parseInt(companyId) : (req.query.companyId ? parseInt(req.query.companyId) : null);
      const solicitud = await service.updateEstado(id, estado, cid);
      if (!solicitud) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
      }
      res.json(solicitud);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/detalle/:detalleId',
  async (req, res, next) => {
    try {
      const { detalleId } = req.params;
      const { cantidadEntregada, companyId } = req.body;
      if (cantidadEntregada === undefined) {
        return res.status(400).json({ message: 'El campo cantidadEntregada es requerido' });
      }
      const cid = companyId ? parseInt(companyId) : (req.query.companyId ? parseInt(req.query.companyId) : null);
      const result = await service.updateDetalleEntrega(parseInt(detalleId), parseInt(cantidadEntregada), cid);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getSolicitudSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
      const result = await service.delete(id, companyId);
      if (!result) {
        return res.status(404).json({ message: 'Solicitud no encontrada' });
      }
      res.json({ message: 'Solicitud eliminada', id: result.id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
