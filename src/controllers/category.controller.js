import { CategoryModel } from "../models/category.model.js";

export class CategoryController {
    static async getAll(req, res) {

        try {
            const items = await CategoryModel.getAll();
            return res.json(items);
        } catch (e) {
            console.log("Error detectado en el servidor:", e);
            return res.status(500).json({ error: e.message });
        }
    }

    static async create(req, res){

        try {
            const {nombre_categoria} = req.body; 
            if (!nombre_categoria) {
                return res.status(400).json({error: "Debe llenar el campo disponible"});
            }

            const newItem = await CategoryModel.create({nombre_categoria}); 
            return res.status(201).json(newItem);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    }

    static async update(req,res) {

        try {
            const { id } = req.params;
            const updatedItem = await CategoryModel.update(id, req.body);

            if (!updatedItem) {
                return res.status(404).json({error: "Categoria no encontrada"});
            }

            return res.json(updatedItem);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    }

    static async remove(req, res) {
        try {
            const { id } = req.params;
            const deletedItem = await CategoryModel.delete(id);

            if (!deletedItem) {
                return res.status(404).json({ error: "Categoria no encontrada" });
            }

            return res.json({ message: "ICategoria eliminada correctamente" });
        } catch (e) {
            // Código de error de Postgres para violación de Foreign Key constraint
            if (e.code === '23503') {
            return res.status(400).json({
            error: "No se puede eliminar la categoria porque está vinculado a proveedores u otros registros."
            });
            }
    return res.status(500).json({ error: e.message });
  }
}
}

export default CategoryController;