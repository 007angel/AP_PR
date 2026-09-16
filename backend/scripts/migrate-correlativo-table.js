const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Abc123..'
});

async function columnExists(table, column) {
  const r = await client.query(
    "SELECT 1 FROM information_schema.columns WHERE table_name=$1 AND column_name=$2",
    [table, column]
  );
  return r.rows.length > 0;
}

async function run() {
  await client.connect();

  const hasNew = await columnExists('correlativo_tr', 'cod_empresa');
  const hasOld = await columnExists('correlativo_tr', 'ultimo_numero');

  if (hasNew && !hasOld) {
    console.log('La tabla ya tiene la nueva estructura, nada que migrar');
  } else if (hasOld) {
    console.log('Migrando correlativo_tr a la nueva estructura...');
    await client.query(`
      CREATE TABLE correlativo_tr_new (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(10) NOT NULL,
        cod_empresa INTEGER NOT NULL REFERENCES company_tr(id),
        numero INTEGER NOT NULL DEFAULT 0,
        descripcion VARCHAR(100),
        fecha DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tipo, cod_empresa)
      );
    `);
    await client.query(`
      INSERT INTO correlativo_tr_new (tipo, cod_empresa, numero, descripcion, fecha, created_at, updated_at)
      SELECT
        CASE lower(tipo)
          WHEN 'ingreso' THEN 'ing'
          WHEN 'factura' THEN 'fac'
          WHEN 'salida' THEN 'sal'
          WHEN 'solicitud' THEN 'sol'
          ELSE lower(tipo)
        END,
        company_id,
        COALESCE(ultimo_numero, 0),
        descripcion,
        CURRENT_DATE,
        created_at,
        updated_at
      FROM correlativo_tr;
    `);
    await client.query('DROP TABLE correlativo_tr;');
    await client.query('ALTER TABLE correlativo_tr_new RENAME TO correlativo_tr;');
    console.log('Migracion completada, contadores preservados');
  } else {
    console.log('Creando correlativo_tr con la nueva estructura...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS correlativo_tr (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(10) NOT NULL,
        cod_empresa INTEGER NOT NULL REFERENCES company_tr(id),
        numero INTEGER NOT NULL DEFAULT 0,
        descripcion VARCHAR(100),
        fecha DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tipo, cod_empresa)
      );
    `);
    console.log('Tabla creada');
  }

  const r = await client.query('SELECT id, tipo, cod_empresa, numero, descripcion, fecha FROM correlativo_tr ORDER BY cod_empresa, tipo');
  console.table(r.rows);

  await client.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
