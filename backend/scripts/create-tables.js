const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Abc123..'
});

async function run() {
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS ingreso_tr (
      id SERIAL PRIMARY KEY,
      correlativo VARCHAR NOT NULL UNIQUE,
      numero_factura VARCHAR NOT NULL,
      fecha_ingreso TIMESTAMP NOT NULL,
      fecha_digitacion TIMESTAMP NOT NULL,
      cantidad_tarimas INTEGER NOT NULL DEFAULT 0,
      usuario_digito VARCHAR NOT NULL,
      proveedor VARCHAR,
      observaciones TEXT,
      status VARCHAR NOT NULL DEFAULT 'pendiente',
      valor_total DECIMAL(10,2) DEFAULT 0,
      company_id INTEGER,
      user_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('ingreso_tr creada');

  await client.query(`
    CREATE TABLE IF NOT EXISTS ingreso_detalle_tr (
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
  console.log('ingreso_detalle_tr creada');

  await client.end();
  console.log('Listo');
}

run().catch(e => { console.error(e.message); process.exit(1); });
