import db from "../config/db.js";

export class InventoryModel {
    static async getAll(){

        const result = await db.query("SELECT * FROM insumos");
        return result.rows;
    }

    static async create({ nombre_insumo, stock_actual, unidad_medida, stock_minimo, punto_reorden, fk_id_categoria }) {
        const query = `
            INSERT INTO inventario.insumos 
            (nombre_insumo, stock_actual, unidad_medida, stock_minimo, punto_reorden, fk_id_categoria)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;

        const values = [
            nombre_insumo,
            stock_actual,
            unidad_medida,
            stock_minimo || 0,
            punto_reorden || 0,
            fk_id_categoria
        ];

    const result = await db.query(query, values);
    return result.rows[0]; // Retorna el objeto recién insertado con su ID generado
}

    static async update(id_insumos, fields) {
        // Construcción dinámica de consulta SQL según lo que envíe React

        const keys = Object.keys(fields);
        if (keys.length === 0) return null;

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
        const values = Object.values(fields);

        const idPosition = keys.length + 1;

        const query = `
            UPDATE inventario.insumos 
            SET ${setClause} 
            WHERE id_insumos = $${idPosition} 
            RETURNING *;`;

        const result = await db.query(query, [...values, id_insumos]);
        return result.rows[0] || null;
    }

    static async delete(id) {
        const query = `
        DELETE FROM inventario.insumos
        WHERE id_insumos = $1
        RETURNING *;`;

        const result = await db.query(query, [id]);
        return result.rows[0]; // Retorna el registro eliminado para confirmar que existía
    }
}