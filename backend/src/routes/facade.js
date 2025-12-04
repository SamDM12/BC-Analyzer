import express from "express";
import { authenticate } from "../middlewares/auth.js";
const router = express.Router();

router.get("/menu", authenticate, (req, res) => {
    const { role, permissions } = req.user;

    const menu = [];

    if (permissions.includes("VIEW_DASHBOARD")) menu.push({ key: "dashboard", label: "Dashboard" });
    if (permissions.includes("RF_2")) menu.push({ key: "prospectos", label: "Explorador de prospectos" });
    if (permissions.includes("RF_3")) menu.push({ key: "probabilidad", label: "Probabilidad de adquisición" });
    if (permissions.includes("RF_6")) menu.push({ key: "recomendacion", label: "Recomendación comercial" });
    if (permissions.includes("RF_5")) menu.push({ key: "analisis", label: "Análisis de factores influyentes" });
    if (permissions.includes("RF_7")) menu.push({ key: "simulacion", label: "Simulación de escenarios" });
    if (permissions.includes("MANAGE_USERS")) menu.push({ key: "adminUsers", label: "Administración de usuarios" });

    res.json({ role, menu });
});

export default router;