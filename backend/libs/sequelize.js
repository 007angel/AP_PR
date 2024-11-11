require('dotenv').config();
const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const setupModels = require('./../db/models');

// Configuración de Sequelize para conectar a PostgreSQL

console.log('configuracion ',config);
const sequelize = new Sequelize(config.dbName, config.db_user, config.dbPassword, {
    host: config.DB_HOST,
    dialect: 'postgres',
    logging: false,
});

// Inicializar los modelos
setupModels(sequelize);

console.log(config.DB_NAME);
// Verificar la conexión
sequelize.authenticate()
   .then(() => {
        console.log('Conexión a la base de datos establecida correctamente');
    })
   .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
    });

// Sincronizar la base de datos (crear tablas si no existen)
sequelize.sync({ force: false }) // `force: false` evita borrar las tablas existentes
    .then(() => {
        console.log('Base de datos y tablas sincronizadas correctamente');
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });

module.exports = sequelize;
