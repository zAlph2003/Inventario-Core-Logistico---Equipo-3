import { ReportModel } from "../models/report.model.js";

export class ReportController {
  // GET /api/reportes/resumen
  static async getResumen(req, res) {
    try {
      const resumen = await ReportModel.getResumen();
      return res.json(resumen);
    } catch (e) {
      console.error("Error al obtener resumen de reportes:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  // GET /api/reportes/pedidos
  static async getPedidos(req, res) {
    try {
      // Capturamos posibles query params como ? estado=Recibido
      const { estado } = req.query;
      const pedidos = await ReportModel.getPedidos(estado);
      return res.json(pedidos);
    } catch (e) {
      console.error("Error al obtener reporte de pedidos:", e);
      return res.status(500).json({ error: e.message });
    }
  }
}

export default ReportController;