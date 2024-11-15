require('dotenv').config()

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.DB__PORT || 3000,
  db_user: process.env.DB_USERS,
  dbPassword: process.env.DB_PASSWORD,
  dbHost : process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
}

module.exports={config};
