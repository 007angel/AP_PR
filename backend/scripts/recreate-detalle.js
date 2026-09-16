const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();

  await c.query('DROP TABLE IF EXISTS ingreso_detalle_tr CASCADE');
  console.log('ingreso_detalle_tr eliminada');

  await c.query(`
    CREATE TABLE ingreso_detalle_tr (
      id SERIAL PRIMARY KEY,
      ingreso_id INTEGER NOT NULL REFERENCES ingreso_tr(id),
      lote VARCHAR(50) NOT NULL,
      articulo VARCHAR(200) NOT NULL,
      tarima INTEGER NOT NULL DEFAULT 0,
      caja INTEGER NOT NULL DEFAULT 0,
      unidad INTEGER NOT NULL DEFAULT 0,
      total_ingreso INTEGER NOT NULL DEFAULT 0,
      solicitado INTEGER NOT NULL DEFAULT 0,
      entregado INTEGER NOT NULL DEFAULT 0,
      mermas INTEGER NOT NULL DEFAULT 0,
      devolucion INTEGER NOT NULL DEFAULT 0,
      costo_individual DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('ingreso_detalle_tr recreada');

  const r = await c.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='ingreso_detalle_tr' ORDER BY ordinal_position");
  console.log('\n=== ingreso_detalle_tr ===');
  r.rows.forEach(x => console.log(x.column_name + ' | ' + x.data_type));

  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
