import { Router } from "express";
import { ReportController } from "../controllers/report.controller.js";

const router = Router();

router.get("/resumen", ReportController.getResumen);
router.get("/pedidos", ReportController.getPedidos);

export default router;