const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();
  await c.query('ALTER TABLE user_tr ADD COLUMN IF NOT EXISTS codigo VARCHAR(20)');
  await c.query('ALTER TABLE user_tr ADD COLUMN IF NOT EXISTS created_by_company_id INTEGER REFERENCES company_tr(id)');
  await c.query(`UPDATE user_tr SET codigo = 'USR' || LPAD(id::text, 4, '0') WHERE codigo IS NULL`);
  await c.query('CREATE UNIQUE INDEX IF NOT EXISTS user_tr_codigo_unique ON user_tr(codigo)');
  const { rows } = await c.query('SELECT id, codigo, email, company_id, created_by_company_id FROM user_tr ORDER BY id');
  console.table(rows);
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
