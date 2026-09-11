const sequelize = require('../libs/sequelize');

async function createIngresoTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ingreso_tr (
        id SERIAL PRIMARY KEY,
        correlativo VARCHAR(20) UNIQUE NOT NULL,
        numero_factura VARCHAR(50) NOT NULL,
        fecha_ingreso TIMESTAMP NOT NULL,
        fecha_digitacion TIMESTAMP NOT NULL,
        cantidad_tarimas INTEGER DEFAULT 0,
        usuario_digito VARCHAR(100) NOT NULL,
        proveedor VARCHAR(100),
        observaciones TEXT,
        status VARCHAR(20) DEFAULT 'pendiente',
        company_id INTEGER REFERENCES company_tr(id),
        user_id INTEGER REFERENCES user_tr(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla ingreso_tr creada exitosamente');
  } catch (error) {
    console.error('Error al crear tabla ingreso_tr:', error);
  } finally {
    await sequelize.close();
  }
}

createIngresoTable();
