import { InventoryModel } from "../models/inventory.model.js";

export class InventoryController {
    static async getAll(req, res) {

        try {
            const items = await InventoryModel.getAll();
            return res.json(items);
        } catch (e) {
            console.log("Error detectado en el servidor:", e);
            return res.status(500).json({ error: e.message });
        }
    }

    static async create(req, res){

        try {
            const {nombre_insumo, stock_actual, unidad_medida, stock_minimo, punto_reorden, fk_id_categoria} = req.body; //nombre_insumo, stock_actual, unidad_medida, precio_costo, stock_minimo
            if (!nombre_insumo || stock_actual == undefined || !unidad_medida) {
                return res.status(400).json({error: "Debe llenar todos los campos disponibles"});
            }

            const newItem = await InventoryModel.create({nombre_insumo, stock_actual, unidad_medida, stock_minimo, punto_reorden, fk_id_categoria}); //nombre_insumo, stock_actual, unidad_medida, precio_costo, stock_minimo
            return res.status(201).json(newItem);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    }

    static async update(req,res) {

        try {
            const { id } = req.params;
            const updatedItem = await InventoryModel.update(id, req.body);

            if (!updatedItem) {
                return res.status(404).json({error: "Item de inventario no encontrado"});
            }

            return res.json(updatedItem);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const deletedItem = await InventoryModel.delete(id);

            if (!deletedItem) {
                return res.status(404).json({ error: "Item no encontrado" });
            }

            return res.json({ message: "Item eliminado correctamente" });
        } catch (e) {
            // Código de error de Postgres para violación de Foreign Key constraint
            if (e.code === '23503') {
            return res.status(400).json({
            error: "No se puede eliminar el insumo porque está vinculado a proveedores u otros registros."
            });
            }
    return res.status(500).json({ error: e.message });
  }
}
}