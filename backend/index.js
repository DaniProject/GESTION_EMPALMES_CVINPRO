// Importar dependencias
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors'); // Importar cors 

// Configuración inicial
dotenv.config(); // Cargar variables de entorno
 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Middleware para manejar JSON

// Habilitar CORS
app.use(cors({
    origin: 'http://localhost:3000'
}));


// Importar rutas
const usuariosRoutes = require('./modules/usuarios');
const napsRoutes = require('./modules/naps_frm'); // Importar la ruta de Naps
const empalmesRoutes = require('./modules/empalmes'); // Importar la ruta de Empalmes
const abonadosRoutes = require('./modules/abonados'); // Importar la ruta de Abonados

// Rutas base
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/naps', napsRoutes); // Registrar la ruta de Naps
app.use('/api/empalmes', empalmesRoutes); // Registrar la ruta de Empalmes
app.use('/api/abonados', abonadosRoutes); // Registrar la ruta de Abonados
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
    console.log(`-------------------------SISTEMA DE GESTION DE CONTRATOS--------------------------`);
    console.log(`---> Servidor iniciado en el puerto ${PORT}`);
});