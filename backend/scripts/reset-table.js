require('dotenv').config();
const { Sequelize } = require('sequelize');
const setupModels = require('../db/models');

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

setupModels(sequelize);

async function reset() {
  try {
    await sequelize.authenticate();
    await sequelize.query('DELETE FROM user_tr');
    await sequelize.query("ALTER SEQUENCE user_tr_id_seq RESTART WITH 1");
    console.log('Tabla limpia y secuencia reiniciada');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

reset();
