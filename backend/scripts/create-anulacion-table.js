const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();
  await c.query(`
    CREATE TABLE IF NOT EXISTS anulacion_tr (
      id SERIAL PRIMARY KEY,
      ingreso_id INTEGER NOT NULL REFERENCES ingreso_tr(id),
      motivo TEXT,
      solicitado_por INTEGER REFERENCES user_tr(id),
      estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('Tabla anulacion_tr creada');
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
