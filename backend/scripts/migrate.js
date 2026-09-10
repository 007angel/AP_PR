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

async function migrate() {
  try {
    await sequelize.authenticate();
    
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_tr' AND column_name = 'role'
    `);
    
    if (results.length === 0) {
      await sequelize.query('ALTER TABLE user_tr ADD COLUMN role VARCHAR(255) NOT NULL DEFAULT \'user\'');
      await sequelize.query('ALTER TABLE user_tr ADD COLUMN modules JSONB DEFAULT \'[]\'');
      console.log('Columnas role y modules agregadas exitosamente');
    } else {
      console.log('Las columnas ya existen');
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

migrate();
