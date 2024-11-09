const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Datos simulados de usuarios (en producción, usar base de datos)
const users = [];

// Ruta de registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar el usuario simulado
    users.push({ username, password: hashedPassword });
    res.send('Usuario registrado con éxito');
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    console.log('Iniciando sesión...');
    const { username, password } = req.body;

    // Buscar usuario
    const user = users.find(user => user.username === username);
    if (!user) return res.status(400).send('Usuario no encontrado');

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Contraseña incorrecta');

    // Generar token JWT
    const token = jwt.sign({ username }, 'secreto', { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
