import express from 'express';

// Se importan los enrutadores

import inventoryRoutes from "./routes/inventory.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import proveedoresRoutes from "./routes/proveedores.routes.js"
import reportRoutes from "./routes/report.routes.js"; 

const app = express();
const PORT = 3000;

// Middleware para procesar JSON en el cuerpo de las peticiones (req.body)

app.use(express.json());

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor con Express.js funcionando correctamente!');
});

// Se montan las rutas

app.use('/api/inventario', inventoryRoutes);
app.use('/api/categoria', categoryRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/reportes', reportRoutes);  

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});