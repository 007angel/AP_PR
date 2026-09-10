require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERS,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

async function verify() {
  const [columns] = await sequelize.query(`
    SELECT column_name, data_type, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'user_tr' 
    ORDER BY ordinal_position
  `);
  console.log('\nTabla user_tr creada en PostgreSQL:\n');
  console.table(columns);

  const [count] = await sequelize.query('SELECT COUNT(*) as total FROM user_tr');
  console.log('Total registros:', count[0].total);

  await sequelize.close();
  process.exit(0);
}

verify().catch(e => { console.error(e); process.exit(1); });
