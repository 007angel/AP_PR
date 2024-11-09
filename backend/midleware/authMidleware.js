const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).send('No token provided.');

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.status(403).send('Token invalido.');
        req.user = user;
        next();
    });

}

module.exports = authenticateToken;

