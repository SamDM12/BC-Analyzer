import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No autorizado" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contiene id, nombre, role, permissions
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
};

export const requirePermission = (permission) => {
    return (req, res, next) => {
        const perms = req.user?.permissions || [];
        if (!perms.includes(permission)) {
            return res.status(403).json({ error: "Acceso denegado: permiso requerido " + permission });
        }
        next();
    };
};