import { Router } from "express";
import  {ProveedoresController} from "../controllers/proveedores.controller.js";

const router = Router();

router.get("/", ProveedoresController.getAll);          // Consultar
router.post("/", ProveedoresController.create);         // Crear
router.put("/:id", ProveedoresController.update);       // Actualizar
router.delete("/:id", ProveedoresController.remove);    // Eliminar

export default router;