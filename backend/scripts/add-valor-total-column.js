const sequelize = require('../libs/sequelize');

async function addValorTotalColumn() {
  try {
    await sequelize.query(`
      ALTER TABLE ingreso_tr 
      ADD COLUMN IF NOT EXISTS valor_total DECIMAL(10, 2) DEFAULT 0;
    `);
    console.log('Columna valor_total agregada exitosamente');
  } catch (error) {
    console.error('Error al agregar columna valor_total:', error);
  } finally {
    await sequelize.close();
  }
}

addValorTotalColumn();
