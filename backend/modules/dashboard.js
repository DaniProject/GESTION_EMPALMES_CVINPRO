const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.use(express.json());

// 1) Porcentaje de abonados por servicio
router.get('/abonados-por-servicio', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT servicio, COUNT(*) AS total FROM abonados GROUP BY servicio`);
    const total = rows.reduce((s, r) => s + r.total, 0);
    const data = rows.map(r => ({ servicio: r.servicio, total: r.total, percent: total ? +(r.total / total * 100).toFixed(2) : 0 }));
    res.json({ total, data });
  } catch (err) {
    console.error('Error en /abonados-por-servicio:', err);
    res.status(500).json({ error: 'Error al obtener abonados por servicio' });
  }
});

// 2) Porcentaje de puertos usados (cada NAP = 16 puertos)
router.get('/puertos', async (req, res) => {
  try {
    const [[{ used_ports }]] = await db.query(`SELECT COUNT(*) AS used_ports FROM empalmes`);
    const [[{ nap_count }]] = await db.query(`SELECT COUNT(*) AS nap_count FROM naps`);
    const total_ports = (nap_count || 0) * 16;
    const percent_used = total_ports ? +((used_ports / total_ports) * 100).toFixed(2) : 0;
    res.json({ used_ports: Number(used_ports || 0), nap_count: Number(nap_count || 0), total_ports, percent_used });
  } catch (err) {
    console.error('Error en /puertos:', err);
    res.status(500).json({ error: 'Error al obtener datos de puertos' });
  }
});

// 3) Porcentaje de NAPs en uso
router.get('/naps-uso', async (req, res) => {
  try {
    const [[{ naps_in_use }]] = await db.query(`SELECT COUNT(DISTINCT id_nap) AS naps_in_use FROM empalmes`);
    const [[{ total_naps }]] = await db.query(`SELECT COUNT(*) AS total_naps FROM naps`);
    const percent_in_use = total_naps ? +((naps_in_use / total_naps) * 100).toFixed(2) : 0;
    res.json({ naps_in_use: Number(naps_in_use || 0), total_naps: Number(total_naps || 0), percent_in_use });
  } catch (err) {
    console.error('Error en /naps-uso:', err);
    res.status(500).json({ error: 'Error al obtener datos de uso de NAPs' });
  }
});

// 4) NAPs por NAP (puertos usados, percent, saturadas)
router.get('/naps-por-nap', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT n.id_nap, n.codigo_nap, COUNT(e.id_empalme) AS used_ports
      FROM naps n
      LEFT JOIN empalmes e ON n.id_nap = e.id_nap
      GROUP BY n.id_nap, n.codigo_nap
      ORDER BY used_ports DESC
    `);

    const data = rows.map(r => {
      const used = Number(r.used_ports || 0);
      const percent = +(used / 16 * 100).toFixed(2);
      return { id_nap: r.id_nap, codigo_nap: r.codigo_nap, used_ports: used, percent_used: percent, saturated: used >= 16 };
    });

    res.json({ data });
  } catch (err) {
    console.error('Error en /naps-por-nap:', err);
    res.status(500).json({ error: 'Error al obtener NAPs por NAP' });
  }
});

// 4b) NAPs saturadas
router.get('/naps-saturadas', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT n.id_nap, n.codigo_nap, COUNT(e.id_empalme) AS used_ports
      FROM naps n
      LEFT JOIN empalmes e ON n.id_nap = e.id_nap
      GROUP BY n.id_nap, n.codigo_nap
      HAVING used_ports >= 16
      ORDER BY used_ports DESC
    `);
    const data = rows.map(r => ({ id_nap: r.id_nap, codigo_nap: r.codigo_nap, used_ports: Number(r.used_ports || 0) }));
    res.json({ data });
  } catch (err) {
    console.error('Error en /naps-saturadas:', err);
    res.status(500).json({ error: 'Error al obtener NAPs saturadas' });
  }
});

module.exports = router;
