const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();
  await c.query('ALTER TABLE ingreso_tr ALTER COLUMN numero_factura DROP NOT NULL');
  console.log('numero_factura ahora admite NULL');
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
