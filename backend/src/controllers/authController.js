import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Role from "../models/Role.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { nombre, email, password, roleName } = req.body;

        // Buscamos rol por nombre; si no viene, asignamos EJECUTIVO
        const defaultRoleName = roleName || "EJECUTIVO";
        const role = await Role.findOne({ name: defaultRoleName });
        if (!role) return res.status(400).json({ error: "Rol no encontrado" });

        // hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const usuario = await Usuario.create({
            nombre,
            email,
            password: hashed,
            role: role._id
        });

        res.status(201).json(usuario); // toJSON eliminará password
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email }).populate("role");
        if (!usuario) return res.status(400).json({ message: "Credenciales inválidas" });

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) return res.status(400).json({ message: "Credenciales inválidas" });

        // Mapear rol de la BD al frontend
        const roleMap = {
            "GERENCIA": "Gerencia",
            "EJECUTIVO": "Ejecutivo de cuentas"
        };

        const formattedRole = roleMap[usuario.role.name] || "Ejecutivo de cuentas";

        // Crear token JWT
        const payload = {
            id: usuario._id,
            name: usuario.nombre,
            role: formattedRole,
            permissions: usuario.role.permissions
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

        // -------- Formato EXACTO que espera el frontend --------
        const userResponse = {
            id: usuario._id,
            name: usuario.nombre,
            email: usuario.email,
            role: formattedRole,
            permissions: usuario.role.permissions,
            isActive: usuario.activo ?? true,   // fallback si tu schema no lo implementa
            createdAt: usuario.createdAt
        };

        return res.json({ token, user: userResponse });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error en login" });
    }
};