const express = require('express');
const cors = require('cors');
const app = express();
const clientesRoutes = require('./Routes/clientes.routes');
app.use(cors());
app.use(express.json());
app.use('/api/clientes', clientesRoutes);
app.listen(3001, () => {
console.log('Servidor corriendo en http://localhost:3001');
});