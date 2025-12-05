import { login, register } from "../services/authService.js";

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const data = await login(email, password);
    return res.json(data);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

export async function registerController(req, res) {
  try {
    const data = await register(req.body);
    return res.status(201).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}