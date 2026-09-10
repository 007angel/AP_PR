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

async function testCreate() {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');

    const user = await sequelize.models.UserTr.create({
      name: 'Usuario Test',
      email: 'test@test.com',
      password: '12345678',
      status: 'active'
    });
    console.log('Usuario creado:', user.dataValues);

    const users = await sequelize.models.UserTr.findAll();
    console.log('Total usuarios:', users.length);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testCreate();
