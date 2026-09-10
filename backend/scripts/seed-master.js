require('dotenv').config();
const bcrypt = require('bcryptjs');
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

async function seed() {
  try {
    await sequelize.authenticate();
    
    const existingMaster = await sequelize.models.UserTr.findOne({ 
      where: { email: 'admin@techsolutions.com' } 
    });
    
    if (existingMaster) {
      console.log('Usuario master ya existe');
      await sequelize.close();
      process.exit(0);
    }

    const hash = await bcrypt.hash('Master123!', 10);
    
    await sequelize.models.UserTr.create({
      name: 'Administrador Master',
      email: 'admin@techsolutions.com',
      password: hash,
      role: 'master',
      status: 'active',
      modules: ['users', 'dashboard', 'reports', 'settings']
    });

    console.log('Usuario master creado exitosamente');
    console.log('Email: admin@techsolutions.com');
    console.log('Password: Master123!');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seed();
