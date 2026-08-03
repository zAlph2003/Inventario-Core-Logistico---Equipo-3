import { ProveedoresModel } from "../models/proveedores.model.js";

export class ProveedoresController {
    static async getAll(req, res) {

        try {
            const items = await ProveedoresModel.getAll();
            return res.json(items);
        } catch (e) {
            console.log("Error detectado en el servidor:", e);
            return res.status(500).json({ error: e.message });
        }
    }

    static async create(req, res){

        try {
            const {nombre_empresa, identificacion_rif, ciudad, telefono_empresa, email_empresa, direccion, nombre_encargado} = req.body; 
            if (!nombre_empresa || !identificacion_rif || !ciudad || !telefono_empresa || !email_empresa || !direccion || !nombre_encargado) {
                return res.status(400).json({error: "Debe llenar todos los campos disponibles"});
            }

            const newItem = await ProveedoresModel.create({nombre_empresa, identificacion_rif, ciudad, telefono_empresa, email_empresa, direccion, nombre_encargado}); 
            return res.status(201).json(newItem);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    }

    static async update(req,res) {

        try {
            const { id } = req.params;
            const updatedItem = await ProveedoresModel.update(id, req.body);

            if (!updatedItem) {
                return res.status(404).json({error: "Proveedor no encontrado"});
            }

            return res.json(updatedItem);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const deletedItem = await ProveedoresModel.delete(id);

            if (!deletedItem) {
                return res.status(404).json({ error: "Proveedor no encontrado" });
            }

            return res.json({ message: "Proveedor eliminado correctamente" });
        } catch (e) {
            // Código de error de Postgres para violación de Foreign Key constraint
            if (e.code === '23503') {
            return res.status(400).json({
            error: "No se puede eliminar el proveedor porque está vinculado a insumos."
            }); 
            }
    return res.status(500).json({ error: e.message });
  }
}
}

export default ProveedoresController;