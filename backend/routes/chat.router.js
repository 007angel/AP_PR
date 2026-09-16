const express = require('express');
const ChatService = require('../services/chat.service');
const validatorHandler = require('../middlewares/validator.handler');
const { sendMessageSchema, createKnowledgeSchema, updateKnowledgeSchema, getKnowledgeSchema } = require('../schemas/chat.schema');

const router = express.Router();
const service = new ChatService();

router.post('/message',
  validatorHandler(sendMessageSchema, 'body'),
  async (req, res, next) => {
    try {
      const { pregunta, userId } = req.body;
      const result = await service.sendMessage(pregunta, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/history',
  async (req, res, next) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId) : null;
      const limit = parseInt(req.query.limit) || 20;
      const history = await service.getHistory(userId, limit);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/faq',
  async (req, res, next) => {
    try {
      const faq = await service.getFaq();
      res.json(faq);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/seed',
  async (req, res, next) => {
    try {
      const result = await service.seedKnowledge();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/knowledge',
  validatorHandler(createKnowledgeSchema, 'body'),
  async (req, res, next) => {
    try {
      const entry = await service.createKnowledge(req.body);
      res.status(201).json(entry);
    } catch (error) {
      next(error);
    }
  }
);

router.put('/knowledge/:id',
  validatorHandler(getKnowledgeSchema, 'params'),
  validatorHandler(updateKnowledgeSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const entry = await service.updateKnowledge(id, req.body);
      if (!entry) {
        return res.status(404).json({ message: 'Entrada no encontrada' });
      }
      res.json(entry);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/knowledge/:id',
  validatorHandler(getKnowledgeSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await service.deleteKnowledge(id);
      if (!result) {
        return res.status(404).json({ message: 'Entrada no encontrada' });
      }
      res.json({ message: 'Entrada eliminada', id: result.id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
