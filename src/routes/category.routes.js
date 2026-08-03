import { Router } from "express";
import  {CategoryController} from "../controllers/category.controller.js";

const router = Router();

router.get("/", CategoryController.getAll);          // Consultar
router.post("/", CategoryController.create);         // Crear
router.put("/:id", CategoryController.update);       // Actualizar
router.delete("/:id", CategoryController.remove);    // Eliminar

export default router;