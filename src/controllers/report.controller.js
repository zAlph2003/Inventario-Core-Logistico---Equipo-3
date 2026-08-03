import { ReportModel } from "../models/report.model.js";

export class ReportController {
  static async getSummary(req, res) {
    try {
      const summary = await ReportModel.getSummary();
      return res.json(summary);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async getOrdersReport(req, res) {
    try {
      const { estado, periodo } = req.query;
      const orders = await ReportModel.getOrdersReport({ estado, periodo }); //REVISAR
      return res.json(orders);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
}