const express = require('express');
const router = express.Router();

const usuario = require('./usuario');

router.use('/usuario', usuario);

module.exports = router;