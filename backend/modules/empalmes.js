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

    try {
        const query = `
            INSERT INTO empalmes (id_nap, puerto, potencia_abn, id_abonado, observaciones)
            VALUES (?, ?, ?, ?, ?);
        `;
        const [result] = await db.query(query, [id_nap, puerto, potencia_abn, id_abonado, observaciones]);

        const newEmpalme = {
            id_empalme: result.insertId,
            id_nap,
            puerto,
            potencia_abn,
            id_abonado,
            observaciones
        };

        res.status(201).json(newEmpalme);
    } catch (err) {
        console.error('Error al guardar el empalme:', err);
        res.status(500).json({ error: 'Error al guardar el empalme' });
    }
});

module.exports = router; // Exportar el enrutador