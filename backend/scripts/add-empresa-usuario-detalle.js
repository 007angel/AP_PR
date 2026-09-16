const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();
  await c.query('ALTER TABLE ingreso_detalle_tr ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_tr(id)');
  await c.query('ALTER TABLE ingreso_detalle_tr ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES user_tr(id)');
  // Rellenar lineas existentes desde su ingreso padre
  const r = await c.query(`
    UPDATE ingreso_detalle_tr d
    SET company_id = i.company_id, user_id = i.user_id
    FROM ingreso_tr i
    WHERE d.ingreso_id = i.id AND d.company_id IS NULL
  `);
  console.log(`Columnas agregadas. ${r.rowCount} lineas existentes rellenadas desde su ingreso.`);
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
