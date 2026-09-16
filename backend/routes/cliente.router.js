const express = require('express');
const ClienteService = require('../services/cliente.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createClienteSchema, updateClienteSchema, getClienteSchema } = require('../schemas/cliente.schema');

const router = express.Router();
const service = new ClienteService();

router.get('/',
  async (req, res, next) => {
    try {
      const { companyId, q } = req.query;
      if (q) {
        const clientes = await service.search(q, companyId ? parseInt(companyId) : null);
        return res.json(clientes);
      }
      const filters = {};
      if (companyId) filters.companyId = parseInt(companyId);
      const clientes = await service.find(filters);
      res.json(clientes);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/search',
  async (req, res, next) => {
    try {
      const { q, companyId } = req.query;
      const clientes = await service.search(q || '', companyId ? parseInt(companyId) : null);
      res.json(clientes);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getClienteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const cliente = await service.findOne(id);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createClienteSchema, 'body'),
  async (req, res, next) => {
    try {
      const cliente = await service.create(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      next(error);
    }
  }
);

router.put('/:id',
  validatorHandler(getClienteSchema, 'params'),
  validatorHandler(updateClienteSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const cliente = await service.update(id, req.body);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.json(cliente);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getClienteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await service.delete(id);
      if (!result) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.json({ message: 'Cliente eliminado', id: result.id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
