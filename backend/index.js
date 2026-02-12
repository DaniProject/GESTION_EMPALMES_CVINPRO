// Importar dependencias
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors'); // Importar cors 
const pool = require('./config/db');

// Configuración inicial
dotenv.config(); // Cargar variables de entorno
 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Middleware para manejar JSON

// Habilitar CORS
app.use(cors({
    origin: ['http://localhost:3000', 'https://daniproject.github.io'], // Permitir solicitudes desde estos orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir estos métodos HTTP
    allowedHeaders: ['Content-Type', 'Authorization'] // Permitir estos encabezados
}));

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('✅ Conectado a MySQL correctamente');
  } catch (err) {
    console.error('❌ Error BD:', err);
  }
})();
// Importar rutas
const usuariosRoutes = require('./modules/usuarios');
const napsRoutes = require('./modules/naps_frm'); // Importar la ruta de Naps
const empalmesRoutes = require('./modules/empalmes'); // Importar la ruta de Empalmes
const abonadosRoutes = require('./modules/abonados'); // Importar la ruta de Abonados
const statsRoutes = require('./modules/dashboard');

// Rutas base
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/naps', napsRoutes); // Registrar la ruta de Naps
app.use('/api/empalmes', empalmesRoutes); // Registrar la ruta de Empalmes
app.use('/api/abonados', abonadosRoutes); // Registrar la ruta de Abonados
app.use('/api/stats', statsRoutes); // Registrar la ruta de estadísticas
// Ruta raíz
app.get('/', (req, res) => {
    res.send('API funcionando correctamente'); 
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(' ██████╗ █████╗ ██████╗ ██╗     ███████╗██╗   ██╗██╗███████╗██╗ ██████╗ ███╗   ██╗');
    console.log('██╔════╝██╔══██╗██╔══██╗██║     ██╔════╝██║   ██║██║██╔════╝██║██╔═══██╗████╗  ██║');
    console.log('██║     ███████║██████╔╝██║     █████╗  ██║   ██║██║███████╗██║██║   ██║██╔██╗ ██║');
    console.log('██║     ██╔══██║██╔══██╗██║     ██╔══╝  ╚██╗ ██╔╝██║╚════██║██║██║   ██║██║╚██╗██║');
    console.log('╚██████╗██║  ██║██████╔╝███████╗███████╗ ╚████╔╝ ██║███████║██║╚██████╔╝██║ ╚████║');
    console.log(' ╚═════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝  ╚═══╝  ╚═╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝');
    console.log(`-------------------------SISTEMA DE GESTION DE EMPALMES--------------------------`);
    console.log(`---> Servidor iniciado en el puerto ${PORT}`);
});

