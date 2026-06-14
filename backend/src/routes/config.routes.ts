import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const configPublicRoutes = Router();

configPublicRoutes.get('/whatsapp', async (_req: Request, res: Response) => {
  try {
    const config = await prisma.systemConfig.findUnique({ where: { key: 'whatsapp_number' } });
    res.json({ phoneNumber: config?.value || '' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
