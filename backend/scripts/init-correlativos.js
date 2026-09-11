const sequelize = require('../libs/sequelize');
const CorrelativoTrService = require('../services/correlativo.service');

async function initCorrelativos(companyId) {
  try {
    const service = new CorrelativoTrService();
    const correlativos = await service.initDefaultCorrelativos(companyId);
    console.log('Correlativos inicializados:', correlativos);
  } catch (error) {
    console.error('Error al inicializar correlativos:', error);
  } finally {
    await sequelize.close();
  }
}

// Obtener companyId de los argumentos de linea de comandos
const companyId = process.argv[2] || 1;
initCorrelativos(companyId);
