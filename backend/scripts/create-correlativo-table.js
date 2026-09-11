const sequelize = require('../libs/sequelize');

async function createCorrelativoTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS correlativo_tr (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL REFERENCES company_tr(id),
        tipo VARCHAR(20) NOT NULL,
        prefijo VARCHAR(10) NOT NULL,
        ultimo_numero INTEGER DEFAULT 0,
        descripcion VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(company_id, tipo)
      );
    `);
    console.log('Tabla correlativo_tr creada exitosamente');
  } catch (error) {
    console.error('Error al crear tabla correlativo_tr:', error);
  } finally {
    await sequelize.close();
  }
}

createCorrelativoTable();
