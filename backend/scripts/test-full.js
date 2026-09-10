require('dotenv').config();
const { Sequelize } = require('sequelize');
const setupModels = require('../db/models');
const http = require('http');

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

async function testAPI() {
  try {
    await sequelize.authenticate();
    console.log('1. DB conectada');

    const data = JSON.stringify({
      name: 'Juan Perez API',
      email: 'juanapi@test.com',
      password: '12345678',
      status: 'active'
    });

    const result = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/user',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });

    console.log('2. POST /api/v1/user Status:', result.status);
    console.log('3. Response:', result.body);

    const [users] = await sequelize.query('SELECT * FROM user_tr');
    console.log('4. Usuarios en BD:', users.length);
    console.table(users);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testAPI();
