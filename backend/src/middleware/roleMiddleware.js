export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    const { tipoUsuario } = req.usuario;

    if (!rolesPermitidos.includes(tipoUsuario)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    next();
  };
}