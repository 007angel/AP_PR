const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

const TIPOS = [
  ['ing', 'Ingresos'],
  ['fac', 'Facturas'],
  ['sal', 'Salidas'],
  ['sol', 'Solicitudes']
];

async function run() {
  await c.connect();
  for (const [tipo, desc] of TIPOS) {
    const r = await c.query(
      `INSERT INTO correlativo_tr (tipo, cod_empresa, numero, descripcion, fecha)
       SELECT $1::varchar(10), c.id, 0, ($2 || ' de la empresa ' || c.id)::varchar(100), CURRENT_DATE
       FROM company_tr c
       WHERE NOT EXISTS (
         SELECT 1 FROM correlativo_tr t WHERE t.cod_empresa = c.id AND t.tipo = $1::varchar(10)
       )`,
      [tipo, desc]
    );
    console.log(`Tipo ${tipo}: ${r.rowCount} filas creadas`);
  }
  const { rows } = await c.query('SELECT id, tipo, cod_empresa, numero FROM correlativo_tr ORDER BY cod_empresa, tipo');
  console.table(rows);
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
