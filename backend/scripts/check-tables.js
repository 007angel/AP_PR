const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();

  const r1 = await c.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='ingreso_tr' ORDER BY ordinal_position");
  console.log('=== ingreso_tr ===');
  r1.rows.forEach(x => console.log(x.column_name + ' | ' + x.data_type + ' | nullable:' + x.is_nullable));

  const r2 = await c.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='ingreso_detalle_tr' ORDER BY ordinal_position");
  console.log('\n=== ingreso_detalle_tr ===');
  r2.rows.forEach(x => console.log(x.column_name + ' | ' + x.data_type + ' | nullable:' + x.is_nullable));

  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
