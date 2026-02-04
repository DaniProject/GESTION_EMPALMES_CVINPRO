const express = require('express');
const db = require('../config/db');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware para manejar JSON
router.use(express.json());

// Ruta para obtener todos los abonados
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM abonados
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error obteniendo abonados:', err);
        res.status(500).json({ error: 'Error al obtener abonados' });
    }
});

// Ruta para guardar un nuevo abonado
router.post('/', async (req, res) => {
    const { nombre_abonado, codigo_abonado, servicio, fecha_alta, estado } = req.body;

    try {
        const query = 
            `INSERT INTO abonados (nombre_abonado, codigo_abonado, servicio, fecha_alta, estado)
            VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [nombre_abonado, codigo_abonado, servicio, fecha_alta, estado || 'Activo']);

        const newAbonado = {
            id_abonado: result.insertId,
            nombre_abonado,
            codigo_abonado,
            servicio,
            fecha_alta,
            estado: estado || 'Activo' 
        };

        res.status(201).json(newAbonado);
    } catch (err) {
        console.error('Error al guardar el abonado:', err);
        res.status(500).json({ error: 'Error al guardar el abonado' });
    }
});

// Ruta para obtener tracking de un abonado
router.get('/tracking/:id_abonado', async (req, res) => {
    const { id_abonado } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT a.*, 
                   n.codigo_nap, 
                   n.gps_lat, 
                   n.gps_lng, 
                   e.puerto, 
                   e.potencia_abn,
                   n.cable,
                   n.buffer,
                   m.codigo_mufa,
                   n.hilo,
                   n.potencia_nap,
                   n.pre_spliter
            FROM abonados a
            LEFT JOIN empalmes e ON a.id_abonado = e.id_abonado
            LEFT JOIN naps n ON e.id_nap = n.id_nap
            LEFT JOIN mufas m ON n.mufa = m.id_mufa
            WHERE a.id_abonado = ?
        `, [id_abonado]);
        res.json(rows);
    } catch (err) {
        console.error('Error en la consulta tracking:', err);
        res.status(500).json({ error: 'Error al obtener datos de tracking' });
    }
});

module.exports = router;