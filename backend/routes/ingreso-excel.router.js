const express = require('express');
const multer = require('multer');
const IngresoExcelService = require('../services/ingreso-excel.service');

const router = express.Router();
const service = new IngresoExcelService();

// Multer: almacenar en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      return cb(new Error('Solo se permiten archivos .xlsx o .xls'), false);
    }
    cb(null, true);
  }
});

// Descargar plantilla Excel
router.get('/template/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const workbook = await service.generateTemplate(parseInt(companyId));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=plantilla_ingreso.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
});

// Subir Excel y crear ingreso + líneas
router.post('/upload/:companyId', upload.single('archivo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se envió ningún archivo.' });
    }

    const companyId = parseInt(req.params.companyId) || null;
    const userId = req.body.userId ? parseInt(req.body.userId) : null;
    const userRole = req.body.userRole || 'user';
    if (userRole !== 'master' && userRole !== 'admin') {
      const limite = new Date();
      limite.setDate(limite.getDate() - 15);
      limite.setHours(0, 0, 0, 0);
      if (req.body.fechaIngreso) {
        const fecha = new Date(req.body.fechaIngreso);
        if (fecha < limite) {
          return res.status(400).json({ message: 'Solo puede registrar ingresos con fecha no mayor a 15 dias. Solicite al administrador.' });
        }
      }
    }

    const result = await service.parseAndCreate(req.file.buffer, companyId, userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
