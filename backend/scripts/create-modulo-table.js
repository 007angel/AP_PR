const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();
  await c.query(`
    CREATE TABLE IF NOT EXISTS modulo_tr (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL UNIQUE,
      ruta VARCHAR(255) NOT NULL,
      icono VARCHAR(10) DEFAULT '📦',
      orden INTEGER NOT NULL DEFAULT 0,
      activo BOOLEAN NOT NULL DEFAULT true,
      descripcion TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('Tabla modulo_tr creada');
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
