const sequelize = require('../libs/sequelize');

async function createCompanyTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS company_tr (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        rif VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(50),
        state VARCHAR(50),
        country VARCHAR(50) DEFAULT 'Venezuela',
        logo VARCHAR(255),
        website VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        plan VARCHAR(20) DEFAULT 'basic',
        max_users INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla company_tr creada exitosamente');
  } catch (error) {
    console.error('Error al crear tabla company_tr:', error);
  } finally {
    await sequelize.close();
  }
}

createCompanyTable();
