import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const paymentPublicRoutes = Router();

paymentPublicRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const options = await prisma.paymentOption.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
