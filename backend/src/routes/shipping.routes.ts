import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

export const shippingPublicRoutes = Router();

shippingPublicRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const options = await prisma.shippingOption.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
