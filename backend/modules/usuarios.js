const express = require('express');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router(); // Crear un enrutador
 
// Middleware para manejar JSON
router.use(express.json());

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios'); // Ajusta la query si es necesario
        res.json(rows);
    } catch (err) {
        console.error('Error obteniendo usuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Endpoint para el login
router.post('/login', async (req, res) => {
    const { nombre_usuario, pass_usuario } = req.body;
    console.log('Datos recibidos:', req.body);

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
        if (pass_usuario !== user.pass_usuario) {
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


