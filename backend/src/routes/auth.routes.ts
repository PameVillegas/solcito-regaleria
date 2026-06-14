import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../services/auth.service';

export const authRoutes = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Intente más tarde.' },
});

authRoutes.post('/login', loginLimiter, async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
    return;
  }

  const result = await login(username, password);

  if (!result.success) {
    res.status(401).json({ error: result.error });
    return;
  }

  res.json({ token: result.token });
});

authRoutes.post('/logout', (_req: Request, res: Response) => {
  res.json({ message: 'Sesión cerrada' });
});
