import express from 'express';

const app = express();
const PORT = 3000;

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor con Express.js funcionando correctamente!');
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});