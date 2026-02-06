const express = require('express');
const db = require('../config/db');
const router = express.Router(); // Crear un enrutador
const jwt = require('jsonwebtoken');

// Middleware para manejar JSON
router.use(express.json());

//Ruta para obtener todas los empalmes
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.id_empalme,
                e.id_nap,
                e.puerto,
                e.potencia_abn,
                a.codigo_abonado,
                e.observaciones
            FROM empalmes e
            INNER JOIN abonados a ON e.id_abonado = a.id_abonado;
            `); // Ajusta la query si es necesario
        res.json(rows);
    } catch (err) {
        console.error('Error obteniendo empalmes:', err);
        res.status(500).json({ error: 'Error al obtener empalmes' });
    }
});

// Ruta para guardar un nuevo empalme
router.post('/', async (req, res) => {
    const { id_nap, puerto, potencia_abn, id_abonado, observaciones } = req.body;

    // Validate required fields
    if (!id_nap || !puerto || !potencia_abn || !id_abonado) {
        return res.status(400).json({ 
            error: 'Faltan campos requeridos: id_nap, puerto, potencia_abn, id_abonado' 
        });
    }

    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        // Decode token to get user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta');
        const id_usuario = decoded.id_usuario || decoded.id;

        const query = `
            INSERT INTO empalmes (id_nap, puerto, potencia_abn, id_abonado, observaciones, id_usuario)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const [result] = await db.query(query, [id_nap, puerto, potencia_abn, id_abonado, observaciones, id_usuario]);

        const newEmpalme = {
            id_empalme: result.insertId,
            id_nap,
            puerto,
            potencia_abn,
            id_abonado,
            observaciones,
            id_usuario
        };

        res.status(201).json(newEmpalme);
    } catch (err) {
        console.error('Error al guardar el empalme:', err);
        
        // Provide more specific error messages
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(400).json({ error: 'NAP o Abonado no existe' });
        } else if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Este empalme ya existe' });
        } else if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ error: 'Token inválido' });
        } else {
            res.status(500).json({ error: 'Error al guardar el empalme: ' + err.message });
        }
    }
});

module.exports = router; // Exportar el enrutador