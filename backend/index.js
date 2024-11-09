'use strict';

const express = require('express');
const app = express();
const port = 3000;

app.use (express.json());

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/usuario');

app.use('/api/auth', authRouter);
app.use('/api/usuarios', indexRouter);



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

