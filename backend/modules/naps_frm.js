const express = require('express');
const db = require('../config/db');
const router = express.Router(); // Crear un enrutador
const jwt = require('jsonwebtoken');

// Middleware para manejar JSON
router.use(express.json());

//Ruta para obtener todas las cajas NAP
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM naps'); // Ajusta la query si es necesario
        res.json(rows);
    } catch (err) {
        console.error('Error obteniendo cajas NAP:', err);
        res.status(500).json({ error: 'Error al obtener cajas NAP' });
    }
});

router.get('/diagrama/:id_nap', async (req, res) => {
    const { id_nap } = req.params;
    console.log('ID NAP:', id_nap); // Log para verificar el ID NAP recibido
    try {
        const query = `
            SELECT 
                e.puerto,
                a.nombre_abonado
            FROM empalmes e
            LEFT JOIN abonados a ON e.id_abonado = a.id_abonado
            WHERE e.id_nap = ?;
        `;

        const [rows] = await db.query(query, [id_nap]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron datos para el NAP especificado' });
        }

        res.json(rows);
    } catch (err) {
        console.error('Error al obtener el diagrama de empalme:', err);
        res.status(500).json({ error: 'Error al obtener el diagrama de empalme' });
    }
});


// Ruta para agregar los datos de una caja NAP 
router.post('/', async (req, res) => {
    const {
        codigo_nap,
        gps_lat,
        gps_lng,
        cable,
        mufa,
        buffer,
        hilo,
        pre_spliter,
        spliter_type,
        potencia_nap
    } = req.body;

    try {
        const now = new Date();
        const fecha_instalacion = now.toISOString().slice(0, 19).replace('T', ' ');

        const result = await db.query(
            'INSERT INTO naps (codigo_nap, gps_lat, gps_lng, cable, mufa, buffer, hilo, pre_spliter, spliter_type, potencia_nap, fecha_instalacion, tecnico_installer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [codigo_nap, gps_lat, gps_lng, cable, mufa, buffer, hilo, pre_spliter, spliter_type, potencia_nap, fecha_instalacion, 'Nicanor']
        );

        const newNap = {
            id_nap: result.insertId,
            codigo_nap,
            gps_lat,
            gps_lng,
            cable,
            mufa,
            buffer,
            hilo,
            pre_spliter,
            spliter_type,
            potencia_nap,
            fecha_instalacion,
            tecnico_installer: 'Nicanor'
        };

        res.status(201).json(newNap);
    } catch (err) {
        console.error('Error al guardar la caja NAP:', err);
        res.status(500).json({ error: 'Error al guardar la caja NAP' });
    }
});

module.exports = router; // Exportar el enrutador