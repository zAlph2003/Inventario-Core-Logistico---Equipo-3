import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller.js";

const router = Router();

router.get("/", InventoryController.getAll);          // Consultar
router.post("/", InventoryController.create);         // Crear
router.put("/:id", InventoryController.update);       // Actualizar
router.delete("/:id", InventoryController.remove);    // Eliminar

export default router;