import db from "../config/db.js";

export class ReportModel {
  // Resumen Ejecutivo (KPIs)
  static async getResumen() {
    const query = `
      SELECT 
        COALESCE(COUNT(id_orden_compra), 0)::INT AS total_pedidos,
        COALESCE(SUM(costo_unitario * cantidad_pedido), 0)::NUMERIC(12,2) AS ingresos_brutos,
        COALESCE(ROUND(AVG(tiempo_entrega_dias * 86400)), 0)::INT AS tiempo_promedio_seg,
        14.2 AS pct_cambio_pedidos,   -- Valores de referencia/comparativa
        18.5 AS pct_cambio_ingresos
      FROM inventario.proveedores_insumo;
    `;

    const result = await db.query(query);
    return result.rows[0];
  }

  // Reporte Histórico de Pedidos / Compras
  static async getPedidos(estado) {
    let query = `
      SELECT 
        pi.id_orden_compra AS id_pedido,
        pi.id_orden_compra AS num_ticket,
        pi.fecha_emision AS hora_creacion,
        p.nombre_empresa AS cliente_nombre,
        'proveedor' AS tipo,
        ROUND((pi.costo_unitario * pi.cantidad_pedido)::numeric, 2) AS total,
        pi.estado_envio AS "Estatus_Orden"
      FROM inventario.proveedores_insumo pi
      JOIN inventario.proveedores p ON pi.fk_id_proveedor = p.id_proveedor
    `;

    const values = [];

    if (estado) {
      query += ` WHERE LOWER(pi.estado_envio) = LOWER($1)`;
      values.push(estado);
    }

    query += ` ORDER BY pi.fecha_emision DESC;`;

    const result = await db.query(query, values);
    return result.rows;
  }
}