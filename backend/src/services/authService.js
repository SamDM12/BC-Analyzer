import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export async function login(email, password) {
  const usuario = await Usuario.findOne({ email, activo: true }).exec();

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  const match = await bcrypt.compare(password, usuario.password);
  if (!match) {
    throw new Error("Contraseña incorrecta");
  }

  // Payload del token
  const token = jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return {
    token,
    usuario: usuario.toJSON()
  };
}

export async function register(data) {
  const { email, password, nombre, tipoUsuario } = data;

  const existe = await Usuario.findOne({ email });
  if (existe) {
    throw new Error("El correo ya está registrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const nuevo = new Usuario({
    nombre,
    email,
    password: passwordHash,
    tipoUsuario: tipoUsuario || "ANALISTA_DATOS",
  });

  await nuevo.save();

  return nuevo.toJSON();
}