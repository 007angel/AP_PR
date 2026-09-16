const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();
  await c.query('ALTER TABLE ingreso_detalle_tr ADD COLUMN IF NOT EXISTS foto TEXT');
  console.log('Columna foto agregada a ingreso_detalle_tr');
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
