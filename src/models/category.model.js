import db from "../config/db.js";

export class CategoryModel {
    static async getAll(){

        const result = await db.query("SELECT * FROM categoria");
        return result.rows;
    }

    static async create({nombre_categoria}) {
        const query = `
            INSERT INTO inventario.categoria 
            (nombre_categoria)
            VALUES ($1) RETURNING *;`;

        const values = [
            nombre_categoria
        ];

    const result = await db.query(query, values);
    return result.rows[0]; // Retorna el objeto recién insertado con su ID generado
}

    static async update(id_categoria, fields) {
        // Construcción dinámica de consulta SQL según lo que envíe React

        const keys = Object.keys(fields);
        if (keys.length === 0) return null;

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
        const values = Object.values(fields);

        const idPosition = keys.length + 1;

        const query = `
            UPDATE inventario.categoria 
            SET ${setClause} 
            WHERE id_categoria = $${idPosition} 
            RETURNING *;`;

        const result = await db.query(query, [...values, id_categoria]);
        return result.rows[0] || null;
    }

    static async delete(id) {
        const query = `
        DELETE FROM inventario.categoria
        WHERE id_categoria = $1
        RETURNING *;`;

        const result = await db.query(query, [id]);
        return result.rows[0]; // Retorna el registro eliminado para confirmar que existía
    }
}