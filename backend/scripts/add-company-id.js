const sequelize = require('../libs/sequelize');

async function addCompanyIdToUser() {
  try {
    await sequelize.query(`
      ALTER TABLE user_tr 
      ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_tr(id);
    `);
    console.log('Columna company_id agregada a user_tr exitosamente');
  } catch (error) {
    console.error('Error al agregar company_id:', error);
  } finally {
    await sequelize.close();
  }
}

addCompanyIdToUser();
