import db from "../config/db.js";

export class ProveedoresModel {
    static async getAll(){

        const result = await db.query("SELECT * FROM proveedores");
        return result.rows;
    }

    static async create({ nombre_empresa, identificacion_rif, ciudad, telefono_empresa, email_empresa, direccion, nombre_encargado }) {
        const query = `
            INSERT INTO inventario.proveedores 
            (nombre_empresa, identificacion_rif, ciudad, telefono_empresa, email_empresa, direccion, nombre_encargado)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;

        const values = [
            nombre_empresa,
            identificacion_rif,
            ciudad,
            telefono_empresa,
            email_empresa,
            direccion,
            nombre_encargado
        ];

    const result = await db.query(query, values);
    return result.rows[0]; // Retorna el objeto recién insertado con su ID generado
}

    static async update(id_proveedor, fields) {
        // Construcción dinámica de consulta SQL según lo que envíe React

        const keys = Object.keys(fields);
        if (keys.length === 0) return null;

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
        const values = Object.values(fields);

        const idPosition = keys.length + 1;

        const query = `
            UPDATE inventario.proveedores 
            SET ${setClause} 
            WHERE id_proveedor = $${idPosition} 
            RETURNING *;`;

        const result = await db.query(query, [...values, id_proveedor]);
        return result.rows[0] || null;
    }

    static async delete(id) {
        const query = `
        DELETE FROM inventario.proveedores
        WHERE id_proveedor = $1
        RETURNING *;`;

        const result = await db.query(query, [id]);
        return result.rows[0]; // Retorna el proveedor eliminado para confirmar que existía
    }
}