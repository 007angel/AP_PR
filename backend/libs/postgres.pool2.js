const { Pool } = require('pg')
const { config } = require('./../config/config')



const USERS = encodeURIComponent(config.db_users)
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgress://${USERS}: ${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
const pool= new Pool({connectionString:URI})

module.exports=pool;

/* const pool= new Pool({
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password:'Datos$01',
    database:'postgres'
}) */
