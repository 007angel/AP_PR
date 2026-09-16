const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();
  let r = await c.query(
    "UPDATE ingreso_tr SET company_id = CAST(SUBSTRING(correlativo FROM 4 FOR 3) AS INTEGER) " +
    "WHERE company_id IS NULL AND correlativo ~ '^[A-Z]{3}[0-9]{7}$'"
  );
  console.log('company_id rellenados:', r.rowCount);
  r = await c.query(
    'UPDATE ingreso_tr i SET user_id = u.id FROM user_tr u ' +
    'WHERE i.user_id IS NULL AND i.usuario_digito = u.name'
  );
  console.log('user_id rellenados:', r.rowCount);
  const rows = await c.query('SELECT id, correlativo, company_id, user_id, usuario_digito FROM ingreso_tr ORDER BY id');
  console.table(rows.rows);
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
