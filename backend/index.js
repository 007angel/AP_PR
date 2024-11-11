const express = require('express');
const morgan =require('morgan')
const isOden=require('is-odd');
const app = express();
app.use(express.json())
app.use(morgan('dev'))
const routerApi = require('./routes');
const { json } = require('express');




routerApi(app)
app.listen(3000)
console.log(`server activo ${3000}`)
