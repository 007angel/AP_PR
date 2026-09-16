const sequelize = require('../libs/sequelize');

async function createCorrelativoTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS correlativo_tr (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(10) NOT NULL,
        cod_empresa INTEGER NOT NULL REFERENCES company_tr(id),
        numero INTEGER NOT NULL DEFAULT 0,
        descripcion VARCHAR(100),
        fecha DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tipo, cod_empresa)
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
