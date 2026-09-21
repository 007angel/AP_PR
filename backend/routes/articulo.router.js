const express = require('express');
const ArticuloService = require('../services/articulo.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createArticuloSchema, updateArticuloSchema, getArticuloSchema } = require('../schemas/articulo.schema');

const router = express.Router();
const service = new ArticuloService();

router.get('/',
  async (req, res, next) => {
    try {
      const { companyId, q } = req.query;
      if (q) {
        const articulos = await service.search(q, companyId ? parseInt(companyId) : null);
        return res.json(articulos);
      }
      const filters = {};
      if (companyId) filters.companyId = parseInt(companyId);
      const articulos = await service.find(filters);
      res.json(articulos);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/search',
  async (req, res, next) => {
    try {
      const { q, companyId } = req.query;
      const articulos = await service.search(q || '', companyId ? parseInt(companyId) : null);
      res.json(articulos);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getArticuloSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
      const articulo = await service.findOne(id, companyId);
      if (!articulo) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
      }
      res.json(articulo);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createArticuloSchema, 'body'),
  async (req, res, next) => {
    try {
      const articulo = await service.create(req.body);
      res.status(201).json(articulo);
    } catch (error) {
      next(error);
    }
  }
);

router.put('/:id',
  validatorHandler(getArticuloSchema, 'params'),
  validatorHandler(updateArticuloSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const companyId = req.body.companyId || req.query.companyId ? parseInt(req.body.companyId || req.query.companyId) : null;
      const articulo = await service.update(id, req.body, companyId);
      if (!articulo) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
      }
      res.json(articulo);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getArticuloSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const companyId = req.query.companyId ? parseInt(req.query.companyId) : null;
      const result = await service.delete(id, companyId);
      if (!result) {
        return res.status(404).json({ message: 'Artículo no encontrado' });
      }
      res.json({ message: 'Artículo eliminado', id: result.id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
