const db = require('../config/db');
const bcrypt = require('bcrypt');

(async function migrate() {
  try {
    const [rows] = await db.query('SELECT id_usuario, pass_usuario FROM usuarios');
    const saltRounds = 10;

    for (const row of rows) {
      const current = row.pass_usuario || '';
      if (typeof current === 'string' && current.startsWith('$2')) {
        console.log(`Skipping id ${row.id_usuario}: already hashed`);
        continue;
      }

      const hash = await bcrypt.hash(current, saltRounds);
      await db.query('UPDATE usuarios SET pass_usuario = ? WHERE id_usuario = ?', [hash, row.id_usuario]);
      console.log(`Hashed password for id ${row.id_usuario}`);
    }

    console.log('Password migration complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error migrating passwords:', err);
    process.exit(1);
  }
})();
