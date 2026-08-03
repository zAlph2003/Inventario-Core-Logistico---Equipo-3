import db from "../config/db.js";

//REVISAR TODO ESTO

export class ReportModel {
  static async getSummary() {
    
    const totalOrdersRes = await db.query("SELECT COUNT(*) as total FROM ordenes");
    const ingreso = await db.query("SELECT SUM(total) as ingresos FROM ordenes WHERE Estatus_Orden != 'Cancelado'");

    return {
      total_pedidos: totalOrdersRes.rows[0]?.total || 0,
      ingresos_brutos: ingreso.rows[0]?.ingresos || 0.0,
      tiempo_promedio_seg: 680,
      pct_cambio_pedidos: 14.2,
      pct_cambio_ingresos: 18.5
    };
  }

  static async getOrdersReport({ estado, periodo }) {
    let sql = "SELECT id_pedido, num_ticket, hora_creacion, cliente_nombre, tipo, total, Estatus_Orden FROM ordenes";
    const params = [];

    if (estado) {
      sql += " WHERE Estatus_Orden = ?";
      params.push(estado);
    }

    const result = await db.query(sql, params);
    return result.rows;
  }
}