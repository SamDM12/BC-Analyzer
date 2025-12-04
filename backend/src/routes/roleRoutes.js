import express from "express";
import Role from "../models/Role.js";

console.log(">> roleRoutes CARGADO");

const router = express.Router();

// ⚠️ Ruta temporal para crear roles (luego se puede proteger con permisos)
router.post("/", async (req, res) => {
    console.log(">> BODY RECIBIDO:", req.body);

    try {
        const role = await Role.create(req.body);
        res.status(201).json(role);
    } catch (error) {
        console.error(">> ERROR MONGOOSE:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;