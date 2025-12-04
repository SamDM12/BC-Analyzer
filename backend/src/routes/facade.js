import express from "express";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.get("/menu", authenticate, (req, res) => {
    const { role, permissions } = req.user;

    const menu = [];

    if (permissions.includes("VIEW_DASHBOARD")) menu.push({ key: "dashboard", label: "Dashboard" });
    if (permissions.includes("EXPLORADOR_DE_PROSPECTOS")) menu.push({ key: "prospectos", label: "Explorador de prospectos" });
    if (permissions.includes("OBTENCION_DE_PROBABILIDAD")) menu.push({ key: "probabilidad", label: "Probabilidad de adquisición" });
    if (permissions.includes("INTERPRETACION_CUALITATIVA")) menu.push({ key: "interpretacion", label: " Clasificar el resultado numérico" });
    if (permissions.includes("RECOMENDACION_ACCION_COMERCIAL")) menu.push({ key: "recomendacion", label: "Recomendación comercial" });
    if (permissions.includes("JUSTIFICACION_RESULTADO")) menu.push({ key: "justificacion", label: "Análisis de factores influyentes" });
    if (permissions.includes("SIMULACION_WHAT_IF")) menu.push({ key: "simulacion", label: "Simulación de escenarios" });
    if (permissions.includes("MANAGE_USERS")) menu.push({ key: "adminUsers", label: "Administración de usuarios" });

    res.json({ role, menu });
});

export default router;