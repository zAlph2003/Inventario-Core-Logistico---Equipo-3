import { Router } from "express";
import { ReportController } from "../controllers/report.controller.js";

const router = Router();

router.get("/resumen", ReportController.getSummary);
router.get("/pedidos", ReportController.getOrdersReport);

export default router;