const sequelize = require('../libs/sequelize');

async function createIngresoDetalleTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ingreso_detalle_tr (
        id SERIAL PRIMARY KEY,
        ingreso_id INTEGER NOT NULL REFERENCES ingreso_tr(id) ON DELETE CASCADE,
        lote VARCHAR(50) NOT NULL,
        articulo VARCHAR(200) NOT NULL,
        tarima INTEGER DEFAULT 0,
        caja INTEGER DEFAULT 0,
        unidad INTEGER DEFAULT 0,
        total_ingreso INTEGER DEFAULT 0,
        solicitado INTEGER DEFAULT 0,
        entregado INTEGER DEFAULT 0,
        mermas INTEGER DEFAULT 0,
        devolucion INTEGER DEFAULT 0,
        costo_individual DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla ingreso_detalle_tr creada exitosamente');
  } catch (error) {
    console.error('Error al crear tabla ingreso_detalle_tr:', error);
  } finally {
    await sequelize.close();
  }
}

createIngresoDetalleTable();
