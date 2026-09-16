const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

async function run() {
  await c.connect();
  await c.query('ALTER TABLE user_tr ADD COLUMN IF NOT EXISTS id_usuario_master INTEGER REFERENCES user_tr(id)');
  await c.query('ALTER TABLE user_tr ADD COLUMN IF NOT EXISTS id_empresa_master INTEGER REFERENCES company_tr(id)');
  await c.query('UPDATE user_tr SET id_empresa_master = created_by_company_id WHERE id_empresa_master IS NULL AND created_by_company_id IS NOT NULL');
  const { rows } = await c.query('SELECT id, codigo, email, company_id, id_usuario_master, id_empresa_master FROM user_tr ORDER BY id');
  console.table(rows);
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
