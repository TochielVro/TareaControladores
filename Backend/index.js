const express = require('express');
const cors = require('cors');
const app = express();

// Importar rutas
const clientesRoutes = require('./Routes/clientes.routes');
const usuariosRoutes = require('./Routes/usuarios.routes');
const productosRoutes = require('./Routes/productos.routes');
const ventasRoutes = require('./Routes/ventas.routes');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/clientes', clientesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);

// Iniciar servidor
app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});