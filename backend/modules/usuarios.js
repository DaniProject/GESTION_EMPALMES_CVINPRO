const express = require('express');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router(); // Crear un enrutador
 
// Middleware para manejar JSON
router.use(express.json());

// Obtener todos los usuarios (sin devolver contraseñas)
router.get('/', async (req, res) => { 
    try {
        const [rows] = await db.query(
            'SELECT id_usuario, nombre_usuario, user_usuario, rol_usuario FROM usuarios'
        );
        res.json(rows);
    } catch (err) {
        console.error('Error obteniendo usuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Endpoint para el login
router.post('/login', async (req, res) => {
    const { nombre_usuario, pass_usuario } = req.body;
    console.log('Login attempt for user:', nombre_usuario);

    if (!nombre_usuario || !pass_usuario) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    try {
        const [rows] = await db.query
        (`SELECT u.id_usuario, 
                u.nombre_usuario, 
                u.user_usuario,
                u.pass_usuario,
                u.rol_usuario, 
                r.nombre_rol AS rol_nombre 
                FROM usuarios u 
                JOIN roles r ON u.rol_usuario = r.id_roles 
                WHERE u.user_usuario = ?`, [nombre_usuario]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];
        // Comparar contraseña con hash almacenado
        const match = await bcrypt.compare(pass_usuario, user.pass_usuario);
        if (!match) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user.id_usuario, rol: user.rol_usuario }, 'clave_secreta', { expiresIn: '1h' });

        return res.status(200).json({
            mensaje: 'Login exitoso',
            usuario: { 
                id_usuario: user.id_usuario,
                nombre_usuario: user.nombre_usuario,
                rol_id: user.rol_usuario,  
            },
            token // Opcional: solo si usas JWT
        });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

// Exportar el enrutador
module.exports = router;

// Endpoint para registrar un nuevo usuario (hashea la contraseña antes de guardar)
router.post('/register', async (req, res) => {
    const { rol_usuario, nombre_usuario, user_usuario, pass_usuario} = req.body;

    if (!user_usuario || !pass_usuario) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    try {
        const [exists] = await db.query('SELECT id_usuario FROM usuarios WHERE user_usuario = ?', [user_usuario]);
        if (exists.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(pass_usuario, saltRounds);

        const [result] = await db.query(
            'INSERT INTO usuarios (rol_usuario, nombre_usuario, user_usuario, pass_usuario) VALUES (?, ?, ?, ?)',
            [rol_usuario || 2, nombre_usuario || null, user_usuario, hash]
        );

        return res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    } catch (err) {
        console.error('Error creando usuario:', err);
        return res.status(500).json({ message: 'Error al crear usuario' });
    }
});


