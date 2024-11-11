const {Sequelize}=require('sequelize')
//const { Pool } = require('pg')
const { config } = require('./../config/config')
//const { config } = require('./../config/config2')
const setupModels = require('./../db/models')

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${'postgres'}:${'123456'}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

//const pool= new Pool({connectionString:uri})
const sequelize = new Sequelize(URI,{
  dialect:'postgres',
  logging:true
})

//funcion para llamara la tabla creada en el index / user.model

setupModels(sequelize)

//inicializar la sincronizacion con la creacion de la base de datos
sequelize.sync();

module.exports=sequelize;

/* const pool= new Pool({
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    password:'Datos$01',
    database:'postgres'
}) */
