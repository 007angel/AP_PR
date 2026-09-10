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
    logging: console.log,
  }
);

setupModels(sequelize);

async function createTable() {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a PostgreSQL');

    await sequelize.sync({ force: true });
    console.log('Tabla user_tr creada correctamente');

    await sequelize.close();
    console.log('Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTable();
