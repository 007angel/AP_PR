const express = require('express');
const morgan =require('morgan')
//const { json } = require('express');
const app = express();
app.use(express.json())
app.use(morgan('dev'))
const routerApi = require('./routes');





routerApi(app)
app.listen(3000)
console.log(`server activo localhost ${3000}`)
