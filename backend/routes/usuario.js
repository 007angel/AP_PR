const express = require('express');
const router = express.Router();
const authenticateToken = require('../midleware/authMidleware');

router.get('/', authenticateToken, (req, res) => {
    res.send('me ubico en la ruta usuario');
});



module.exports = router;