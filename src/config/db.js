import { configDotenv } from "dotenv"; // Cargar variables de entorno desde el archivo .env
import pkg from "pg"; // Importar el paquete 'pg' para la conexión a PostgreSQL

configDotenv();

const { Pool } = pkg; // Desestructurar Pool del paquete 'pg'

//Se usa process.env para acceder a las variables de entorno definidas en el archivo .env
const pool = new Pool({
  user: process.env.DB_USER, // Usuario de la base de datos
  host: process.env.DB_HOST, // Host de la base de datos
  database: process.env.DB_NAME, // Nombre de la base de datos
  password: String(process.env.DB_PASSWORD || ''), // Contraseña de la base de datos
  port: Number(process.env.DB_PORT), // Puerto de la base de datos
  options: "-c search_path=inventario,public" // Esquema por defecto
});

//Mensaje para confirmar que la configuración de la base de datos se ha realizado correctamente
console.log("Configuración de la base de datos realizada correctamente.");

//Exportar el pool de conexión para que pueda ser utilizado en src/models 
export default pool;