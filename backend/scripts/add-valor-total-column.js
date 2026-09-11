const { Client } = require('pg');

async function addValorTotalColumn() {
  const client = new Client({
    user: 'postgres',
    password: 'Abc123..',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  try {
    await client.connect();
    await client.query(`
      ALTER TABLE ingreso_tr 
      ADD COLUMN IF NOT EXISTS valor_total DECIMAL(10, 2) DEFAULT 0;
    `);
    console.log('Columna valor_total agregada exitosamente');
  } catch (error) {
    console.error('Error al agregar columna valor_total:', error);
  } finally {
    await client.end();
  }
}

addValorTotalColumn();
